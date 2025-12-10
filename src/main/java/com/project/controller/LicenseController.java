package com.project.controller;

import com.project.dto.LicenseDto;
import com.project.service.LicenseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/licenses")
public class LicenseController {

    private final LicenseService licenseService;

    public LicenseController(LicenseService licenseService) {
        this.licenseService = licenseService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN', 'PROCUREMENT_OFFICER', 'COMPLIANCE_OFFICER', 'IT_AUDITOR')")
    public ResponseEntity<Page<LicenseDto>> getAllLicenses(@RequestParam(required = false) Integer vendorId, Pageable pageable) {
        Page<LicenseDto> licenses = licenseService.getAllLicenses(vendorId, pageable);
        return ResponseEntity.ok(licenses);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER')")
    public ResponseEntity<LicenseDto> createLicense(@Valid @RequestBody LicenseDto licenseDto) {
        LicenseDto createdLicense = licenseService.createLicense(licenseDto);
        return new ResponseEntity<>(createdLicense, HttpStatus.CREATED);
    }
}
