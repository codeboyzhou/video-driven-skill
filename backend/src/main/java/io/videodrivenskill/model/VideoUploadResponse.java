package io.videodrivenskill.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoUploadResponse {
  private String videoId;
  private String filename;
  private long duration; // seconds
  private long fileSize;
}
