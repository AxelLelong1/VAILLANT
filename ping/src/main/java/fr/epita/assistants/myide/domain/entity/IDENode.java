package fr.epita.assistants.myide.domain.entity;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class IDENode implements Node {

    private Path path_;
    private Type type_;
    private Node parent;

    private List<@NotNull Node> children_;

    private void initNode(Path path, Node parent)
    {
        this.parent = parent;
        this.children_ = new ArrayList<>();
        this.path_ = path.toAbsolutePath();
        File file_ = new File(path.toString());
        if (file_.isDirectory())
        {
            this.type_ = Types.FOLDER;
            File[] children_files = file_.listFiles();
            if (children_files != null)
            {
                for (File f : children_files)
                    this.children_.add(new IDENode(f.toPath(), this));
            }
        }
        else
            this.type_ = Types.FILE;
    }
    public IDENode(Path path)
    {
        initNode(path, null);
    }

    public IDENode(String path)
    {
        initNode(Path.of(path), null);
    }

    public IDENode(Path path, Node parent)
    {
        initNode(path, parent);
    }

    public IDENode(String path, Node parent)
    {
        initNode(Path.of(path), parent);
    }
    @Override
    public Path getPath() { return path_; }

    @Override
    public Type getType() {
        return type_;
    }

    @Override
    public List<@NotNull Node> getChildren() {
        return children_;
    }
    public Node getParent() {
        return parent;
    }

}
