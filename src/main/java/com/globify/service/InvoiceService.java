package com.globify.service;

import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.globify.entity.Invoice;
import com.globify.entity.Order;
import com.globify.repository.InvoiceRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import static com.globify.template.InvoiceTemplateBuilder.buildInvoiceHtml;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Value("${invoice.storage.path}")
    private String basePath;

    // ✅ Ellenőrzi, hogy létezik-e számla a rendeléshez
    public boolean hasInvoice(Order order) {
        return invoiceRepository.findByOrderId(order.getId()).isPresent();
    }

    public String generateInvoiceNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE); // pl. 20250418
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        long countToday = invoiceRepository.countTodayInvoices(startOfDay, endOfDay);
        long next = countToday + 1;
        return "invoice_GLOB-" + datePart + "-" + next;
    }

    public Path getInvoiceDirectory() throws Exception {
        Path path = Paths.get(basePath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        return path;
    }

    public Path getInvoiceFilePath(String invoiceNumber) throws Exception {
        return getInvoiceDirectory().resolve(invoiceNumber + ".pdf");
    }

    @Transactional
    public Invoice generateInvoice(Order order) throws Exception {
        if (invoiceRepository.findByOrderId(order.getId()).isPresent()) {
            throw new IllegalStateException("Ehhez a rendeléshez már létezik számla.");
        }

        String invoiceNumber = generateInvoiceNumber();
        String html = buildInvoiceHtml(order, invoiceNumber);
        Path pdfPath = getInvoiceFilePath(invoiceNumber);

        try (OutputStream os = new FileOutputStream(pdfPath.toFile())) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFont(
                    new File("src/main/resources/fonts/DejaVuSans.ttf"),
                    "DejaVu Sans",
                    400,
                    BaseRendererBuilder.FontStyle.NORMAL,
                    true
            );
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
        }

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setOrder(order);
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setPdfPath(pdfPath.toString());

        invoiceRepository.save(invoice);
        return invoice;
    }

    public File getInvoicePdfFile(Invoice invoice) {
        return new File(invoice.getPdfPath());
    }

}
