/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  dev.langchain4j.agent.tool.Tool
 *  lombok.Generated
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Component
 */
package com.project.ai;

import com.project.dto.DeviceDto;
import com.project.dto.LicenseDto;
import com.project.entity.License;
import com.project.repository.LicenseRepository;
import com.project.service.DeviceService;
import com.project.service.LicenseService;
import dev.langchain4j.agent.tool.Tool;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.Generated;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class LicenseTrackerTools {
    @Generated
    private static final Logger log = LoggerFactory.getLogger(LicenseTrackerTools.class);
    private final DeviceService deviceService;
    private final LicenseService licenseService;
    private final LicenseRepository licenseRepository;

    @Tool(value={"gets a summary of all registered devices in the system"})
    public String getDeviceSummary() {
        log.info("AI Tool: Executing getDeviceSummary");
        try {
            Page<DeviceDto> devicesPage = this.deviceService.getAllDevices("", (Pageable)PageRequest.of((int)0, (int)1000));
            long totalDevices = devicesPage.getTotalElements();
            if (totalDevices == 0L) {
                return "There are no devices registered in the system.";
            }
            long activeDevices = devicesPage.getContent().stream().filter(d -> "ACTIVE".equalsIgnoreCase(String.valueOf((Object)d.getStatus()))).count();
            return String.format("There are a total of %d devices in the system. %d of them are currently ACTIVE.", totalDevices, activeDevices);
        }
        catch (Exception e) {
            log.error("AI Tool: Error fetching device summary", (Throwable)e);
            return "Sorry, I encountered an error while fetching the device summary.";
        }
    }

    @Tool(value={"gets a summary of all registered software licenses in the system"})
    public String getLicenseSummary() {
        log.info("AI Tool: Executing getLicenseSummary");
        try {
            Page<LicenseDto> licensePage = this.licenseService.getAllLicenses(null, (Pageable)PageRequest.of((int)0, (int)1000));
            long totalLicenses = licensePage.getTotalElements();
            if (totalLicenses == 0L) {
                return "There are no licenses registered in the system.";
            }
            return "Here is a summary of the first 10 licenses:\n" + licensePage.getContent().stream().limit(10L).map(lic -> String.format("- '%s' (Key: %s)", lic.getSoftwareName(), lic.getLicenseKey())).collect(Collectors.joining("\n"));
        }
        catch (Exception e) {
            log.error("AI Tool: Error fetching license summary", (Throwable)e);
            return "Sorry, I encountered an error while fetching the license summary.";
        }
    }

    @Tool(value={"finds specific details for a given device ID, for example 'DEV-001'"})
    public String getDeviceDetails(String deviceId) {
        log.info("AI Tool: Executing getDeviceDetails for deviceId: {}", (Object)deviceId);
        if (deviceId == null || deviceId.trim().isEmpty()) {
            return "You must provide a device ID to look up.";
        }
        try {
            Optional<DeviceDto> deviceOpt = this.deviceService.getDeviceById(deviceId);
            if (deviceOpt.isEmpty()) {
                return String.format("Sorry, I could not find a device with the ID '%s'.", deviceId);
            }
            DeviceDto device = deviceOpt.get();
            return String.format("Here are the details for device %s:\n- Type: %s\n- Status: %s\n- Location: %s\n- Model: %s", new Object[]{device.getDeviceId(), device.getType(), device.getStatus(), device.getLocation(), device.getModel()});
        }
        catch (Exception e) {
            log.error("AI Tool: Error fetching details for deviceId: {}", (Object)deviceId, (Object)e);
            return String.format("Sorry, I could not find any details for a device with the ID '%s'. Please check the ID and try again.", deviceId);
        }
    }

    @Tool(value={"forecasts the total renewal cost for licenses expiring within a given number of days from now"})
    public String getRenewalForecast(int days) {
        log.info("AI Tool: Executing getRenewalForecast for the next {} days", (Object)days);
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        List<License> expiringLicenses = this.licenseRepository.findByValidToBetween(startDate, endDate);
        if (expiringLicenses.isEmpty()) {
            return String.format("No licenses are due for renewal in the next %d days.", days);
        }
        BigDecimal totalCost = expiringLicenses.stream().map(License::getRenewalCost).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        String licenseDetails = expiringLicenses.stream().map(lic -> String.format("- %s (%s): \u20b9%,.2f", lic.getSoftwareName(), lic.getLicenseKey(), lic.getRenewalCost())).collect(Collectors.joining("\n"));
        return String.format("Here is the renewal forecast for the next %d days:\n%s\n\nTotal Estimated Cost: \u20b9%,.2f", days, licenseDetails, totalCost);
    }

    @Generated
    public LicenseTrackerTools(DeviceService deviceService, LicenseService licenseService, LicenseRepository licenseRepository) {
        this.deviceService = deviceService;
        this.licenseService = licenseService;
        this.licenseRepository = licenseRepository;
    }
}
