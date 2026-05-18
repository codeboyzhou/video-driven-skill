package io.videodrivenskill.repository;

import io.videodrivenskill.model.FrameArchive;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FrameArchiveRepository extends JpaRepository<FrameArchive, String> {

  List<FrameArchive> findAllByOrderByCreatedAtDesc();

  List<FrameArchive> findByVideoArchiveIdOrderByTimestampAsc(String videoArchiveId);

  List<FrameArchive> findByVideoIdOrderByTimestampAsc(String videoId);
}
