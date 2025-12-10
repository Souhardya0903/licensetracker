/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Service
 *  org.springframework.web.multipart.MultipartFile
 */
package com.project.service;

import com.project.aspect.Auditable;
import com.project.dto.DeviceDto;
import com.project.entity.Device;
import com.project.entity.LifecycleStatus;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AssignmentRepository;
import com.project.repository.DeviceRepository;
import com.project.service.DeviceService;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DeviceServiceImpl
implements DeviceService {
    private final DeviceRepository deviceRepository;
    private final AssignmentRepository assignmentRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository, AssignmentRepository assignmentRepository) {
        this.deviceRepository = deviceRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    public Page<DeviceDto> getAllDevices(String location, Pageable pageable) {
        return this.deviceRepository.findByLocationContaining(location, pageable).map(this::convertToDto);
    }

    @Override
    public Optional<DeviceDto> getDeviceById(String deviceId) {
        return this.deviceRepository.findById(deviceId).map(this::convertToDto);
    }

    @Override
    @Auditable(action="Create Device")
    public DeviceDto createDevice(DeviceDto deviceDto) {
        Device device = this.convertToEntity(deviceDto);
        Device savedDevice = (Device)this.deviceRepository.save(device);
        return this.convertToDto(savedDevice);
    }

    @Override
    @Auditable(action="Update Device")
    public DeviceDto updateDevice(String deviceId, DeviceDto deviceDto) {
        Device existingDevice = (Device)this.deviceRepository.findById(deviceId).orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));
        existingDevice.setType(deviceDto.getType());
        existingDevice.setIpAddress(deviceDto.getIpAddress());
        existingDevice.setLocation(deviceDto.getLocation());
        existingDevice.setModel(deviceDto.getModel());
        existingDevice.setStatus(deviceDto.getStatus());
        if (deviceDto.getStatus() == LifecycleStatus.DECOMMISSIONED) {
            this.assignmentRepository.deleteAll(existingDevice.getAssignments());
            existingDevice.getAssignments().clear();
        }
        Device updatedDevice = (Device)this.deviceRepository.save(existingDevice);
        return this.convertToDto(updatedDevice);
    }

    @Override
    @Auditable(action="Delete Device")
    public void deleteDevice(String deviceId) {
        if (!this.deviceRepository.existsById(deviceId)) {
            throw new ResourceNotFoundException("Device not found with ID: " + deviceId);
        }
        this.deviceRepository.deleteById(deviceId);
    }

    @Override
    @Auditable(action="Bulk Create Devices")
    public List<DeviceDto> bulkCreateDevices(MultipartFile file) throws IOException {
        ArrayList<Device> devicesToSave = new ArrayList<Device>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));){
            String line;
            reader.readLine();
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                Device device = Device.builder().deviceId(data[0]).type(data[1]).ipAddress(data[2]).location(data[3]).model(data[4]).status(LifecycleStatus.valueOf(data[5].toUpperCase())).build();
                devicesToSave.add(device);
            }
        }
        return this.deviceRepository.saveAll(devicesToSave).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private Device convertToEntity(DeviceDto deviceDto) {
        Device device = new Device();
        device.setDeviceId(deviceDto.getDeviceId());
        device.setType(deviceDto.getType());
        device.setIpAddress(deviceDto.getIpAddress());
        device.setLocation(deviceDto.getLocation());
        device.setModel(deviceDto.getModel());
        device.setStatus(deviceDto.getStatus());
        return device;
    }
}
