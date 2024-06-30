package fr.epita.assistants.myide.domain.entity.Features.ANY;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.entity.report.SearchFeatureReport;
import fr.epita.assistants.myide.domain.service.IDEProjectService;
import fr.epita.assistants.myide.utils.Logger;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import static fr.epita.assistants.myide.presentation.rest.MyIdeEndpoint.ps;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AnySEARCH extends AnyFeatures implements Feature {

    @Override
    public Feature.ExecutionReport execute(Project project, Object... params) {
        List<String> par = (List<String>)params[0];
        String text = par.get(0);
        List<Node> nodes = project.getRootNode().getChildren();
        Path indexDirPath = ((IDEProjectService)ps).getConfiguration().indexFile();  // Access the indexFile path from the configuration

        try {
            // Create the index
            StandardAnalyzer analyzer = new StandardAnalyzer();
            Directory indexDirectory = FSDirectory.open(indexDirPath);
            IndexWriterConfig config = new IndexWriterConfig(analyzer);
            try (IndexWriter writer = new IndexWriter(indexDirectory, config)) {
                indexNodes(writer, project.getRootNode());
            }
            // Search the index
            List<Node> resultNodes = new ArrayList<>();
            List<String> resultPaths = new ArrayList<>();
            try (DirectoryReader reader = DirectoryReader.open(indexDirectory)) {
                IndexSearcher searcher = new IndexSearcher(reader);
                QueryParser parser = new QueryParser("content", analyzer);
                parser.setAllowLeadingWildcard(true);
                Query query = parser.parse("*" + text + "*");

                TopDocs topDocs = searcher.search(query, 10); // Adjust number of results as needed
                for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                    Document doc = searcher.doc(scoreDoc.doc);
                    Path path = Paths.get(doc.get("path"));
                    resultPaths.add(path.toString());
                    Node node = findNodeByPath(project, nodes, path);
                    if (node != null) {
                        resultNodes.add(node);
                    }
                }
            }
            File[] files = indexDirPath.toFile().listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        file.delete();
                    }
                }
            }
            return new SearchFeatureReport(resultNodes, resultPaths, true);
        } catch (IOException | ParseException e) {
            Logger.logError("Error in AnySearch" + e.getMessage());
            return new SearchFeatureReport(new ArrayList<>(), new ArrayList<>(), false);
        }
    }

    private void indexFile(IndexWriter writer, Path filePath) throws IOException {
        try {
            Document doc = new Document();
            doc.add(new StringField("path", filePath.toString(), Field.Store.YES));
            doc.add(new TextField("content", new String(Files.readAllBytes(filePath)), Field.Store.NO));
            writer.addDocument(doc);
        } catch (IOException e) {
            Logger.logError("Error indexing file: " + filePath);
        }
    }

    private void indexNodes(IndexWriter writer, Node node) throws IOException {
        if (node.isFolder()) {
            for (Node child : node.getChildren()) {
                indexNodes(writer, child);
            }
        } else {
            indexFile(writer, node.getPath());
        }
    }

    private Node findNodeByPath(Project p, List<Node> nodes, Path path) {
        for (Node node : nodes) {
            if (node.getPath().equals(path)) {
                return node;
            }
            if (node.isFolder())
                return findNodeByPath(p, node.getChildren(), path);
        }
        return null;
    }

    @Override
    public Feature.Type type() {
        return Mandatory.Features.Any.SEARCH;
    }
}
