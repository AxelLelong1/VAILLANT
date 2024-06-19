package fr.epita.assistants.myide.domain.entity.Features.ANY;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class AnyDIST extends AnyFeatures implements Feature {
    /**
     * Remove all trash files and create a zip archive.
     * Archive name must be the same as the project name (root node name).
     */

    private boolean _execute(ZipOutputStream zip, Node node, String basepath)
    {
        for(Node n : node.getChildren())
        {
            try {
                ZipEntry ze = new ZipEntry(basepath + n.getPath().getFileName().toString());

                if(n.isFolder())
                {
                    if(new File(n.getPath().toString()).isHidden())
                        continue;

                    zip.putNextEntry(new ZipEntry(basepath + n.getPath().getFileName().toString() + "/"));
                    zip.closeEntry();
                    _execute(zip, n, basepath + n.getPath().getFileName().toString()+"/");
                    continue;
                }
                //read the file and write to ZipOutputStream
                zip.putNextEntry(ze);
                FileInputStream fis = new FileInputStream(n.getPath().toString());

                byte[] buffer = new byte[1024];
                int len;
                while ((len = fis.read(buffer)) > 0) {
                    zip.write(buffer, 0, len);
                }

                zip.closeEntry();
                fis.close();
            } catch (IOException e) {
                Logger.logError("ANYDIST: Coudln't zip");
                return false;
            }
        }
        return true;
    }

    @Override
    public Feature.ExecutionReport execute(Project project, Object... params) {
        //PARAMS = NodeService
        AnyCLEANUP cleanupObj = new AnyCLEANUP();
        cleanupObj.execute(project, params);
        try {
            FileOutputStream f = new FileOutputStream(project.getRootNode().getPath().getFileName().toString()+".zip");
            ZipOutputStream zip = new ZipOutputStream(f);
            boolean succ = _execute(zip, project.getRootNode(), "");
            zip.close();
            f.close();
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
