package com.project.dto;

import com.project.entity.LifecycleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto {
    @NotBlank(message = "Device ID cannot be blank")
    @Size(max = 30, message = "Device ID cannot exceed 30 characters")
    private String deviceId;

    @NotBlank(message = "Type cannot be blank")
    @Size(max = 30, message = "Type cannot exceed 30 characters")
    private String type;

    @NotBlank(message = "IP address cannot be blank")
    @Pattern(regexp = "^([0-9]{1,3}\\.){3}[0-9]{1,3}$", message = "Invalid IP address format")
    @Size(max = 15, message = "IP address cannot exceed 15 characters")
    private String ipAddress;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;

    @NotNull(message = "Status cannot be null")
    private LifecycleStatus status;

    private LocalDateTime createdAt;
}
