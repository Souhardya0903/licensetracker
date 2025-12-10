package com.project.controller;

import com.project.dto.SoftwareVersionDto;
import com.project.service.SoftwareVersionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device-software")
public class SoftwareVersionController {

    private final SoftwareVersionService softwareVersionService;

    public SoftwareVersionController(SoftwareVersionService softwareVersionService) {
        this.softwareVersionService = softwareVersionService;
    }

    @GetMapping("/device/{deviceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ENGINEER', 'IT_AUDITOR')")
    public ResponseEntity<List<SoftwareVersionDto>> getSoftwareVersionsByDeviceId(@PathVariable String deviceId) {
        return ResponseEntity.ok(softwareVersionService.getSoftwareVersionsByDeviceId(deviceId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ENGINEER')")
    public ResponseEntity<SoftwareVersionDto> addSoftwareVersion(@RequestBody SoftwareVersionDto softwareVersionDto) {
        SoftwareVersionDto createdSoftwareVersion = softwareVersionService.addSoftwareVersion(softwareVersionDto);
        return new ResponseEntity<>(createdSoftwareVersion, HttpStatus.CREATED);
    }
}
