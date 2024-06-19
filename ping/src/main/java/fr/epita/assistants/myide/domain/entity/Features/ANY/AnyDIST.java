package fr.epita.assistants.myide.domain.entity.Features.ANY;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;

import java.io.BufferedOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class AnyDIST extends AnyFeatures implements Feature {
    /**
     * Remove all trash files and create a zip archive.
     * Archive name must be the same as the project name (root node name).
     */

    private ZipOutputStream _execute(ZipOutputStream zip, Node node)
    {
        for(Node n : node.getChildren())
        {
            try {
                zip.putNextEntry(new ZipEntry(n.getPath().toString()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            if(n.isFolder())
                zip = _execute(zip, n);
        }

        return zip;
    }

    @Override
    public Feature.ExecutionReport execute(Project project, Object... params) {
        //PARAMS = NodeService
        AnyCLEANUP cleanupObj = new AnyCLEANUP();
        cleanupObj.execute(project, params);
        try {
            FileOutputStream f = new FileOutputStream(project.getRootNode().getPath().getFileName().toString());
            ZipOutputStream zip = new ZipOutputStream(new BufferedOutputStream(f));
            zip = _execute(zip, project.getRootNode());
            zip.close();
        } catch (IOException e) {
            return FalseReport();
        }
        return TrueReport();
    }

    @Override
    public Feature.Type type() {
        return Mandatory.Features.Any.DIST;
    }
}
