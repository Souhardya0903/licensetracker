/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 */
package com.project.service;

import com.project.dto.VendorDto;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VendorService {
    public Page<VendorDto> getAllVendors(String var1, Pageable var2);

    public Optional<VendorDto> getVendorById(Integer var1);

    public VendorDto createVendor(VendorDto var1);

    public Optional<VendorDto> updateVendor(Integer var1, VendorDto var2);

    public boolean deleteVendor(Integer var1);
}
