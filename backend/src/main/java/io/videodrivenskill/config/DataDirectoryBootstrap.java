package io.videodrivenskill.config;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.boot.SpringApplication;

/**
 * Runs before {@link SpringApplication} so SQLite can open {@code video-driven-skill.db} under a
 * directory that already exists. Mirrors the path logic in {@code application.yml} ({@code
 * app.data-dir} / {@code VIDEO_DRIVEN_SKILL_HOME}).
 *
 * @author codeboyzhou
 */
public final class DataDirectoryBootstrap {

  private DataDirectoryBootstrap() {}

  /** Same resolution as {@code app.data-dir} in application.yml. */
  public static Path resolveDataRoot() {
    String override = System.getenv("VIDEO_DRIVEN_SKILL_HOME");
    if (override != null && !override.isBlank()) {
      return Paths.get(override.trim());
    }
    String home = System.getProperty("user.home");
    if (home == null || home.isBlank()) {
      throw new IllegalStateException("System property user.home is not set");
    }
    return Paths.get(home, "video-driven-skill");
  }

  /** Creates the data root (for the DB file) plus uploads/skills/archives. */
  public static void ensureDefaultDataLayout() {
    Path root = resolveDataRoot();
    try {
      Files.createDirectories(root.resolve("uploads"));
      Files.createDirectories(root.resolve("skills"));
      Files.createDirectories(root.resolve("archives"));
    } catch (IOException e) {
      throw new UncheckedIOException("Failed to create data directories under " + root, e);
    }
  }
}
