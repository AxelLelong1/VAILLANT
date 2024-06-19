package Tests;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.ProjectService;
import org.junit.Test;
import org.junit.jupiter.api.parallel.Execution;

import java.nio.file.Path;

public class FeaturesTests {

    @Test
    public void AnyZIPTest()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        Feature.ExecutionReport report = service.execute(p, Mandatory.Features.Any.DIST, service.getNodeService());
        assert (report.isSuccess()) : "Coudln't ZIP";
    }

    @Test
    public void AnyCLEANTest()
    {
        ProjectService service = MyIde.init(null);
        Project p = service.load(Path.of("C:\\Users\\axell\\Downloads\\TestPing"));
        Feature.ExecutionReport report = service.execute(p, Mandatory.Features.Any.CLEANUP, service.getNodeService());
        assert(report.isSuccess()) : "Coudln't erase DA FILE";
    }
}
