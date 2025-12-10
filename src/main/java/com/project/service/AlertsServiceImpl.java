package com.project.service;

import com.project.dto.LicenseDto;
import com.project.repository.LicenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertsServiceImpl implements AlertsService {

    private final LicenseRepository licenseRepository;
    private final LicenseServiceImpl licenseService;

    public AlertsServiceImpl(LicenseRepository licenseRepository, LicenseServiceImpl licenseService) {
        this.licenseRepository = licenseRepository;
        this.licenseService = licenseService;
    }

    @Override
    public List<LicenseDto> getExpiringLicenses(int days) {
        LocalDate thresholdDate = LocalDate.now().plusDays(days);
        return licenseRepository.findByValidToBefore(thresholdDate).stream()
                .map(licenseService::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LicenseDto> getExpiredLicenses() {
        return licenseRepository.findByValidToBefore(LocalDate.now()).stream()
                .map(licenseService::convertToDto)
                .collect(Collectors.toList());
    }
}
