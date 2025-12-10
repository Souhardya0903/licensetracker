package com.project.controller;

import com.project.dto.DeviceDto;
import com.project.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN', 'IT_AUDITOR', 'COMPLIANCE_OFFICER')")
    public ResponseEntity<Page<DeviceDto>> getAllDevices(@RequestParam(defaultValue = "") String location, Pageable pageable) {
        return ResponseEntity.ok(deviceService.getAllDevices(location, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN', 'IT_AUDITOR')")
    public ResponseEntity<DeviceDto> getDeviceById(@PathVariable String id) {
        return deviceService.getDeviceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<DeviceDto> createDevice(@Valid @RequestBody DeviceDto deviceDto) {
        DeviceDto createdDevice = deviceService.createDevice(deviceDto);
        return new ResponseEntity<>(createdDevice, HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeviceDto>> bulkCreateDevices(@RequestParam("file") MultipartFile file) throws IOException {
        List<DeviceDto> createdDevices = deviceService.bulkCreateDevices(file);
        return new ResponseEntity<>(createdDevices, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN', 'OPERATIONS_MANAGER')")
    public ResponseEntity<DeviceDto> updateDevice(@PathVariable String id, @Valid @RequestBody DeviceDto deviceDto) {
        DeviceDto updatedDevice = deviceService.updateDevice(id, deviceDto);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDevice(@PathVariable String id) {
        deviceService.deleteDevice(id);
    }
}
