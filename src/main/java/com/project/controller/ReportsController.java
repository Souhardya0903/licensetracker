package com.project.controller;

import com.project.dto.DeviceDto;
import com.project.service.ReportsService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/non-compliant")
    @PreAuthorize("hasAnyRole('ADMIN', 'IT_AUDITOR', 'COMPLIANCE_LEAD')")
    public ResponseEntity<List<DeviceDto>> getNonCompliantDevices() {
        return ResponseEntity.ok(reportsService.getNonCompliantDevices());
    }

    @GetMapping("/non-compliant/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'IT_AUDITOR', 'COMPLIANCE_LEAD')")
    public ResponseEntity<String> getNonCompliantDevicesCsv() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=non_compliant_devices.csv");
        headers.add("Content-Type", "text/csv");
        return ResponseEntity.ok().headers(headers).body(reportsService.getNonCompliantDevicesCsv());
    }

    @GetMapping("/non-compliant/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'IT_AUDITOR', 'COMPLIANCE_LEAD')")
    public ResponseEntity<InputStreamResource> getNonCompliantDevicesPdf() {
        ByteArrayInputStream bis = reportsService.getNonCompliantDevicesPdf();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=non_compliant_devices.pdf");
        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF).body(new InputStreamResource(bis));
    }
}
