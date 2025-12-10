/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 */
package com.project.service;

import com.project.dto.LicenseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LicenseService {
    public Page<LicenseDto> getAllLicenses(Integer var1, Pageable var2);

    public LicenseDto getLicenseById(String var1);

    public LicenseDto createLicense(LicenseDto var1);

    public LicenseDto updateLicense(String var1, LicenseDto var2);

    public void deleteLicense(String var1);
}
