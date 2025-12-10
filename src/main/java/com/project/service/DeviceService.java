/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.web.multipart.MultipartFile
 */
package com.project.service;

import com.project.dto.DeviceDto;
import com.project.entity.Device;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface DeviceService {
    public Page<DeviceDto> getAllDevices(String var1, Pageable var2);

    public Optional<DeviceDto> getDeviceById(String var1);

    public DeviceDto createDevice(DeviceDto var1);

    public DeviceDto updateDevice(String var1, DeviceDto var2);

    public void deleteDevice(String var1);

    public List<DeviceDto> bulkCreateDevices(MultipartFile var1) throws IOException;

    default public DeviceDto convertToDto(Device device) {
        return DeviceDto.builder().deviceId(device.getDeviceId()).type(device.getType()).ipAddress(device.getIpAddress()).location(device.getLocation()).model(device.getModel()).status(device.getStatus()).createdAt(device.getCreatedAt()).build();
    }
}
