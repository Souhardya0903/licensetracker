/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.dto.DeviceDto;
import com.project.repository.DeviceRepository;
import com.project.service.DeviceServiceImpl;
import com.project.service.PdfGenerationService;
import com.project.service.ReportsService;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ReportsServiceImpl
implements ReportsService {
    private final DeviceRepository deviceRepository;
    private final DeviceServiceImpl deviceService;
    private final PdfGenerationService pdfGenerationService;

    public ReportsServiceImpl(DeviceRepository deviceRepository, DeviceServiceImpl deviceService, PdfGenerationService pdfGenerationService) {
        this.deviceRepository = deviceRepository;
        this.deviceService = deviceService;
        this.pdfGenerationService = pdfGenerationService;
    }

    @Override
    public List<DeviceDto> getNonCompliantDevices() {
        return this.deviceRepository.findDevicesWithNoAssignments().stream().map(this.deviceService::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<DeviceDto> findNonCompliantDevices() {
        return this.getNonCompliantDevices();
    }

    @Override
    public String getNonCompliantDevicesCsv() {
        List<DeviceDto> nonCompliantDevices = this.getNonCompliantDevices();
        if (nonCompliantDevices.isEmpty()) {
            return "";
        }
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("Device ID,Type,IP Address,Location,Model,Status\n");
        for (DeviceDto device : nonCompliantDevices) {
            csvContent.append(String.format("%s,%s,%s,%s,%s,%s\n", new Object[]{device.getDeviceId(), device.getType(), device.getIpAddress(), device.getLocation(), device.getModel(), device.getStatus()}));
        }
        return csvContent.toString();
    }

    @Override
    public ByteArrayInputStream getNonCompliantDevicesPdf() {
        List<DeviceDto> nonCompliantDevices = this.getNonCompliantDevices();
        return this.pdfGenerationService.generateNonCompliantDevicesPdf(nonCompliantDevices);
    }
}
