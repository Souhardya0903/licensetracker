/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.dto.DashboardOverviewDto;
import com.project.repository.DeviceRepository;
import com.project.repository.LicenseRepository;
import com.project.service.DashboardService;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl
implements DashboardService {
    private final DeviceRepository deviceRepository;
    private final LicenseRepository licenseRepository;

    public DashboardServiceImpl(DeviceRepository deviceRepository, LicenseRepository licenseRepository) {
        this.deviceRepository = deviceRepository;
        this.licenseRepository = licenseRepository;
    }

    @Override
    public DashboardOverviewDto getDashboardOverview() {
        long totalDevices = this.deviceRepository.count();
        long totalLicenses = this.licenseRepository.count();
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30L);
        long expiringSoonCount = this.licenseRepository.findByValidToBefore(thirtyDaysFromNow).size();
        long devicesAtRiskCount = 0L;
        return DashboardOverviewDto.builder().totalDevices(totalDevices).totalLicenses(totalLicenses).expiringSoonCount(expiringSoonCount).devicesAtRiskCount(devicesAtRiskCount).build();
    }
}
