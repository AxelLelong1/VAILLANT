package Tests;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.service.ProjectService;
import org.junit.Test;

import java.nio.file.Path;

public class IDESetupTests
{
    @Test
    public void setup()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        System.out.print("[ ");
        for(Aspect a : p.getAspects())
        {
            System.out.print(a.getType());
            System.out.print(",");
        }
        System.out.print(" ]");

        service.execute(p, Mandatory.Features.Git.PULL);
        service.execute(p, Mandatory.Features.Git.ADD, "testCreateFile.txt");
        service.execute(p, Mandatory.Features.Git.COMMIT, "test_create_file");
        service.execute(p, Mandatory.Features.Git.PUSH);
    }

    @Test
    public void AddNodeToRoot()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        service.getNodeService().create(p.getRootNode(), "TOM.txt", Node.Types.FILE);
    }

    @Test
    public void UpdateNodeToRoot()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        for(Node n : p.getRootNode().getChildren())
            if(n.getPath().toFile().getName().compareTo("TestFile.txt") == 0)
                service.getNodeService().update(n, 0, 0, "Salut salut, ceci est un nouveau texte".getBytes());
    }

    @Test
    public void Delete()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        for(Node n : p.getRootNode().getChildren())
            if(n.getPath().toFile().getName().compareTo("TestFile.txt") == 0)
                service.getNodeService().delete(n);
    }
}