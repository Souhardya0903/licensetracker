/*
 * Decompiled with CFR 0.152.
 */
package com.project.service;

import com.project.entity.Software;
import java.util.List;

public interface SoftwareService {
    public List<Software> getAllSoftware();

    public Software createSoftware(Software var1);
}
