package io.videodrivenskill.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FrameInfo {
  private String frameId;
  private double timestamp; // seconds
  private String base64Image;
  private String description;
}
