package com.project.service;

import com.project.dto.LicenseDto;

import java.util.List;

public interface AlertsService {
    List<LicenseDto> getExpiringLicenses(int days);
    List<LicenseDto> getExpiredLicenses();
}
