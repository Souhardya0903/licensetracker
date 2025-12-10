/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.dto.VendorDto;
import com.project.entity.Vendor;
import com.project.exception.DuplicateResourceException;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.VendorRepository;
import com.project.service.VendorService;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VendorServiceImpl
implements VendorService {
    private final VendorRepository vendorRepository;

    public VendorServiceImpl(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @Override
    public Page<VendorDto> getAllVendors(String name, Pageable pageable) {
        Page<Vendor> vendorPage = name != null && !name.isEmpty() ? this.vendorRepository.findByVendorNameContainingIgnoreCase(name, pageable) : this.vendorRepository.findAll(pageable);
        return vendorPage.map(this::convertToDto);
    }

    @Override
    public Optional<VendorDto> getVendorById(Integer id) {
        return this.vendorRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public VendorDto createVendor(VendorDto vendorDto) {
        this.vendorRepository.findByVendorName(vendorDto.getVendorName()).ifPresent(v -> {
            throw new DuplicateResourceException("Vendor with name " + vendorDto.getVendorName() + " already exists.");
        });
        vendorDto.setVendorId(null);
        Vendor vendor = this.convertToEntity(vendorDto);
        return this.convertToDto((Vendor)this.vendorRepository.save(vendor));
    }

    @Override
    public Optional<VendorDto> updateVendor(Integer id, VendorDto vendorDto) {
        return this.vendorRepository.findById(id).map(existingVendor -> {
            this.vendorRepository.findByVendorName(vendorDto.getVendorName()).ifPresent(v -> {
                if (!v.getVendorId().equals(id)) {
                    throw new DuplicateResourceException("Vendor with name " + vendorDto.getVendorName() + " already exists.");
                }
            });
            existingVendor.setVendorName(vendorDto.getVendorName());
            existingVendor.setSupportEmail(vendorDto.getSupportEmail());
            return this.convertToDto((Vendor)this.vendorRepository.save(existingVendor));
        });
    }

    @Override
    public boolean deleteVendor(Integer id) {
        if (!this.vendorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vendor not found with ID: " + id);
        }
        this.vendorRepository.deleteById(id);
        return false;
    }

    private VendorDto convertToDto(Vendor vendor) {
        return VendorDto.builder().vendorId(vendor.getVendorId()).vendorName(vendor.getVendorName()).supportEmail(vendor.getSupportEmail()).build();
    }

    private Vendor convertToEntity(VendorDto vendorDto) {
        return Vendor.builder().vendorId(vendorDto.getVendorId()).vendorName(vendorDto.getVendorName()).supportEmail(vendorDto.getSupportEmail()).build();
    }
}
