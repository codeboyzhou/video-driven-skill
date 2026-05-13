package io.videodrivenskill;

import io.videodrivenskill.config.DataDirectoryBootstrap;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VideoDrivenSkillApplication {
  public static void main(String[] args) {
    DataDirectoryBootstrap.ensureDefaultDataLayout();
    SpringApplication.run(VideoDrivenSkillApplication.class, args);
  }
}
