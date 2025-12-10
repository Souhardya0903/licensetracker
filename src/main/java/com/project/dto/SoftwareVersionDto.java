package com.project.dto;

import com.project.entity.SoftwareStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoftwareVersionDto {
    private Long id;
    private String deviceId;
    private String softwareName;
    private String installedVersion;
    private String latestVersion;
    private SoftwareStatus status;
}
