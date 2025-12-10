/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.itextpdf.kernel.pdf.PdfDocument
 *  com.itextpdf.kernel.pdf.PdfWriter
 *  com.itextpdf.layout.Document
 *  com.itextpdf.layout.element.IBlockElement
 *  com.itextpdf.layout.element.Paragraph
 *  com.itextpdf.layout.element.Table
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.IBlockElement;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.project.dto.DeviceDto;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PdfGenerationService {
    public ByteArrayInputStream generateNonCompliantDevicesPdf(List<DeviceDto> devices) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter((OutputStream)out);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf);){
            document.add((IBlockElement)((Paragraph)new Paragraph("Non-Compliant Devices Report").setBold()).setFontSize(18.0f));
            float[] columnWidths = new float[]{1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f};
            Table table = new Table(columnWidths);
            table.setWidth(100.0f);
            table.addHeaderCell("Device ID");
            table.addHeaderCell("Type");
            table.addHeaderCell("IP Address");
            table.addHeaderCell("Location");
            table.addHeaderCell("Model");
            table.addHeaderCell("Status");
            for (DeviceDto device : devices) {
                table.addCell(device.getDeviceId());
                table.addCell(device.getType());
                table.addCell(device.getIpAddress());
                table.addCell(device.getLocation());
                table.addCell(device.getModel());
                table.addCell(device.getStatus().toString());
            }
            document.add((IBlockElement)table);
        }
        catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}
