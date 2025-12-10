/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.project.repository;

import com.project.entity.License;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LicenseRepository
extends JpaRepository<License, String> {
    public Page<License> findByVendor_VendorId(Integer var1, Pageable var2);

    public List<License> findByValidToBefore(LocalDate var1);

    public List<License> findByValidToBetween(LocalDate var1, LocalDate var2);
}
