/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.dto.SoftwareVersionDto;
import com.project.entity.Device;
import com.project.entity.SoftwareVersion;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.DeviceRepository;
import com.project.repository.SoftwareVersionRepository;
import com.project.service.SoftwareVersionService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SoftwareVersionServiceImpl
implements SoftwareVersionService {
    private final SoftwareVersionRepository softwareVersionRepository;
    private final DeviceRepository deviceRepository;

    public SoftwareVersionServiceImpl(SoftwareVersionRepository softwareVersionRepository, DeviceRepository deviceRepository) {
        this.softwareVersionRepository = softwareVersionRepository;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public List<SoftwareVersionDto> getSoftwareVersionsByDeviceId(String deviceId) {
        return this.softwareVersionRepository.findByDevice_DeviceId(deviceId).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public SoftwareVersionDto addSoftwareVersion(SoftwareVersionDto softwareVersionDto) {
        Device device = (Device)this.deviceRepository.findById(softwareVersionDto.getDeviceId()).orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + softwareVersionDto.getDeviceId()));
        SoftwareVersion softwareVersion = this.convertToEntity(softwareVersionDto, device);
        SoftwareVersion savedSoftwareVersion = (SoftwareVersion)this.softwareVersionRepository.save(softwareVersion);
        return this.convertToDto(savedSoftwareVersion);
    }

    private SoftwareVersionDto convertToDto(SoftwareVersion softwareVersion) {
        return SoftwareVersionDto.builder().id(softwareVersion.getId()).deviceId(softwareVersion.getDevice().getDeviceId()).softwareName(softwareVersion.getSoftwareName()).installedVersion(softwareVersion.getInstalledVersion()).latestVersion(softwareVersion.getLatestVersion()).status(softwareVersion.getStatus()).build();
    }

    private SoftwareVersion convertToEntity(SoftwareVersionDto softwareVersionDto, Device device) {
        return SoftwareVersion.builder().device(device).softwareName(softwareVersionDto.getSoftwareName()).installedVersion(softwareVersionDto.getInstalledVersion()).latestVersion(softwareVersionDto.getLatestVersion()).status(softwareVersionDto.getStatus()).build();
    }
}
