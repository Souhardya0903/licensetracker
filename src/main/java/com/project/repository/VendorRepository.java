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

import com.project.entity.Vendor;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository
extends JpaRepository<Vendor, Integer> {
    public Page<Vendor> findByVendorNameContainingIgnoreCase(String var1, Pageable var2);

    public Optional<Vendor> findByVendorName(String var1);
}
