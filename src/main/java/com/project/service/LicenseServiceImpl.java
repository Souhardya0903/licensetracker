/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.dto.LicenseDto;
import com.project.entity.License;
import com.project.entity.Vendor;
import com.project.exception.DuplicateResourceException;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AssignmentRepository;
import com.project.repository.LicenseRepository;
import com.project.repository.VendorRepository;
import com.project.service.LicenseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LicenseServiceImpl
implements LicenseService {
    private final LicenseRepository licenseRepository;
    private final VendorRepository vendorRepository;
    private final AssignmentRepository assignmentRepository;

    public LicenseServiceImpl(LicenseRepository licenseRepository, VendorRepository vendorRepository, AssignmentRepository assignmentRepository) {
        this.licenseRepository = licenseRepository;
        this.vendorRepository = vendorRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    public Page<LicenseDto> getAllLicenses(Integer vendorId, Pageable pageable) {
        Page<License> licensePage = vendorId != null ? this.licenseRepository.findByVendor_VendorId(vendorId, pageable) : this.licenseRepository.findAll(pageable);
        return licensePage.map(this::convertToDto);
    }

    @Override
    public LicenseDto getLicenseById(String id) {
        return this.licenseRepository.findById(id).map(this::convertToDto).orElseThrow(() -> new ResourceNotFoundException("License not found with ID: " + id));
    }

    @Override
    public LicenseDto createLicense(LicenseDto licenseDto) {
        if (this.licenseRepository.existsById(licenseDto.getLicenseKey())) {
            throw new DuplicateResourceException("License with key " + licenseDto.getLicenseKey() + " already exists.");
        }
        License license = this.convertToEntity(licenseDto);
        return this.convertToDto((License)this.licenseRepository.save(license));
    }

    @Override
    public LicenseDto updateLicense(String id, LicenseDto licenseDto) {
        License existingLicense = (License)this.licenseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("License not found with ID: " + id));
        existingLicense.setSoftwareName(licenseDto.getSoftwareName());
        existingLicense.setValidFrom(licenseDto.getValidFrom());
        existingLicense.setValidTo(licenseDto.getValidTo());
        existingLicense.setLicenseType(licenseDto.getLicenseType());
        existingLicense.setMaxUsage(licenseDto.getMaxUsage());
        existingLicense.setNotes(licenseDto.getNotes());
        existingLicense.setRenewalCost(licenseDto.getRenewalCost());
        if (!existingLicense.getVendor().getVendorId().equals(licenseDto.getVendorId())) {
            Vendor newVendor = (Vendor)this.vendorRepository.findById(licenseDto.getVendorId()).orElseThrow(() -> new ResourceNotFoundException("Vendor not found with ID: " + licenseDto.getVendorId()));
            existingLicense.setVendor(newVendor);
        }
        License updatedLicense = (License)this.licenseRepository.save(existingLicense);
        return this.convertToDto(updatedLicense);
    }

    @Override
    public void deleteLicense(String id) {
        if (!this.licenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("License not found with ID: " + id);
        }
        this.licenseRepository.deleteById(id);
    }

    public LicenseDto convertToDto(License license) {
        long currentUsage = this.assignmentRepository.countByLicense_LicenseKey(license.getLicenseKey());
        return LicenseDto.builder().licenseKey(license.getLicenseKey()).softwareName(license.getSoftwareName()).vendorId(license.getVendor().getVendorId()).validFrom(license.getValidFrom()).validTo(license.getValidTo()).licenseType(license.getLicenseType()).maxUsage(license.getMaxUsage()).currentUsage(currentUsage).notes(license.getNotes()).renewalCost(license.getRenewalCost()).build();
    }

    private License convertToEntity(LicenseDto licenseDto) {
        Vendor vendor = (Vendor)this.vendorRepository.findById(licenseDto.getVendorId()).orElseThrow(() -> new ResourceNotFoundException("Vendor not found with ID: " + licenseDto.getVendorId()));
        return License.builder().licenseKey(licenseDto.getLicenseKey()).softwareName(licenseDto.getSoftwareName()).vendor(vendor).validFrom(licenseDto.getValidFrom()).validTo(licenseDto.getValidTo()).licenseType(licenseDto.getLicenseType()).maxUsage(licenseDto.getMaxUsage()).notes(licenseDto.getNotes()).renewalCost(licenseDto.getRenewalCost()).build();
    }
}
