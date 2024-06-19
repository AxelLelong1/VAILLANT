package Tests;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.ProjectService;
import org.junit.Test;

import java.nio.file.Path;

public class FeaturesTests {

    @Test
    public void AnyZIPTest()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        service.execute(p, Mandatory.Features.Any.DIST, service.getNodeService());
    }
}
