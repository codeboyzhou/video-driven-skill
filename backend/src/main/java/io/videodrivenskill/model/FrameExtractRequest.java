package io.videodrivenskill.model;

import java.util.List;
import lombok.Data;

@Data
public class FrameExtractRequest {
  private List<Double> timestamps; // for manual frame extraction
  private int intervalSeconds = 3; // for auto extraction
}
