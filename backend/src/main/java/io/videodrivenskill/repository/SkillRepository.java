package io.videodrivenskill.repository;

import io.videodrivenskill.model.SkillRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<SkillRecord, String> {
  List<SkillRecord> findAllByOrderByCreatedAtDesc();
}
