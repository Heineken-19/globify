package com.globify.template;

import com.globify.entity.Order;
import com.globify.entity.OrderItem;
import com.globify.entity.OrderBilling;
import com.globify.entity.OrderShipping;
import com.globify.entity.PaymentMethod;
import com.globify.entity.ShippingMethod;

import java.time.format.DateTimeFormatter;

public class InvoiceTemplateBuilder {

    private static String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private static String localizePayment(PaymentMethod method) {
        return switch (method) {
            case CREDIT_CARD -> "Bankkártya";
            case PAYPAL -> "PayPal";
            case BANK_TRANSFER -> "Átutalás";
            case CASH_ON_DELIVERY -> "Utánvét";
        };
    }

    private static String localizeShipping(String method) {
        try {
            return switch (ShippingMethod.valueOf(method)) {
                case HOME_DELIVERY -> "Házhoz szállítás";
                case FOXPOST -> "FoxPost automata";
                case PACKETA -> "Packeta";
                case SHOP -> "Személyes átvétel";
            };
        } catch (IllegalArgumentException e) {
            return method;
        }
    }

    public static String buildInvoiceHtml(Order order, String invoiceNumber) {
        OrderBilling billing = order.getBilling();
        OrderShipping shipping = order.getShipping();

        String buyerName = (billing != null && billing.getCompanyName() != null && !billing.getCompanyName().isBlank())
                ? escapeHtml(billing.getCompanyName())
                : (order.getUser() != null ? escapeHtml(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                : escapeHtml(order.getGuestEmail()));

        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            String name = escapeHtml(item.getProduct().getName());
            int quantity = item.getQuantity();
            int grossPrice = item.getPrice().intValue();
            int netPrice = (int) (grossPrice / 1.27);
            int vatAmount = grossPrice - netPrice;

            itemsHtml.append(String.format("""
                <tr>
                    <td>%s</td>
                    <td>%d db</td>
                    <td>%d Ft</td>
                    <td>%d Ft</td>
                    <td>%d Ft</td>
                </tr>
            """, name, quantity, netPrice, vatAmount, grossPrice));
        }

            int shippingGross = order.getShippingCost().intValue();
            int shippingNet = (int) (shippingGross / 1.27);
            int shippingVat = shippingGross - shippingNet;

        itemsHtml.append(String.format("""
             <tr>
                <td>Szállítási költség</td>
                <td>1 db</td>
                <td>%d Ft</td>
                <td>%d Ft</td>
                <td>%d Ft</td>
             </tr>
            """, shippingNet, shippingVat, shippingGross));

        int grossTotal = order.getOrderItems().stream().mapToInt(i -> i.getPrice().intValue()).sum() + shippingGross;
        int netTotal = (int) (grossTotal / 1.27);
        int vatTotal = grossTotal - netTotal;

        boolean hasDiscount = order.getDiscountAmount() != null && order.getDiscountAmount().intValue() > 0;
        int discountAmount = hasDiscount ? order.getDiscountAmount().intValue() : 0;
        int finalGrossTotal = grossTotal - discountAmount - order.getUsedRewardPoints();

        StringBuilder discountBlock = new StringBuilder();
        if (hasDiscount) {
            discountBlock.append(String.format("""
        <div class="summary">
            Kedvezmény neve / Discount name: %s<br/>
            Kedvezmény összege / Discount amount: -%d Ft<br/>
        </div>
        """, escapeHtml(order.getDiscountName() != null ? order.getDiscountName() : ""), discountAmount));
        }

        if (order.getUsedRewardPoints() > 0) {
            discountBlock.append(String.format("""
        <div class="summary">
            Felhasznált hűségpontok / Used reward points: -%d Ft
        </div>
        """, order.getUsedRewardPoints()));
        }

        String htmlTemplate = """
<html>
<head>
    <meta charset='UTF-8' />
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; padding: 40px; font-size: 12px; }
        .flex { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .block { width: 48%%; }
        .invoice-number { font-size: 16px; margin-bottom: 5px; }
        .section-title { font-weight: bold; margin-bottom: 4px; }
        .summary { font-size: 13px; text-align: right; margin-top: 15px; }
        table { width: 100%%; border-collapse: collapse; margin-top: 30px; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 6px; }
        th { background-color: #f3f3f3; }
        .table-box { display: table; width: 100%%; table-layout: fixed; border: 1px solid #ddd; margin-top: 20px; }
        .table-cell { display: table-cell; padding: 10px; vertical-align: top; }
        .table-cell:first-child { border-right: 1px solid #ddd; }
    </style>
</head>
<body>
<h1>Számla / Invoice</h1>
<div class="invoice-number">FP / %s</div>
<div class="table-box">
    <div class="table-cell">
        <div class="section-title">ELADÓ / SELLER</div>
        JS Global Webshop<br/>
        Budapest, Webshop utca 12.<br/>
        Magyarország<br/>
        Adószám: 12345678-2-42<br/>
        Közösségi adószám: HU12345678<br/>
    </div>
    <div class="table-cell">
        <div class="section-title">VEVŐ / BUYER</div>
        %s<br/>
        %s %s<br/>
        %s<br/>
        Adószám: %s
    </div>
</div>
<div class="flex" style="margin-top: 20px;">
    <div class="block">
        <strong>Számla kelte / Issue date:</strong> %s<br/>
        <strong>Teljesítés kelte / Fulfillment date:</strong> %s
        <strong>Fizetési mód / Payment method:</strong> %s<br/>
        <strong>Szállítási mód / Shipping method:</strong> %s<br/>
    </div>
</div>
<table>
    <tr>
        <th>Megnevezés / Description</th>
        <th>Mennyiség / Quantity</th>
        <th>Nettó egységár / Net Unit Price</th>
        <th>ÁFA / VAT</th>
        <th>Bruttó ár / Gross Price</th>
    </tr>
    %s
</table>
%s
<div class="summary">
    Nettó végösszeg / Net total: %d Ft<br/>
    ÁFA (27%%): %d Ft<br/>
    <strong>Fizetendő bruttó végösszeg: %d Ft</strong>
</div>
</body>
</html>
""";

        return String.format(
                htmlTemplate.stripLeading(),
                escapeHtml(invoiceNumber),
                buyerName,
                escapeHtml(billing != null ? billing.getPostalCode() : ""),
                escapeHtml(billing != null ? billing.getCity() : ""),
                escapeHtml(billing != null ? billing.getStreet() : ""),
                billing != null && billing.getTaxNumber() != null ? escapeHtml(billing.getTaxNumber()) : "N/A",
                order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")),
                order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")),
                escapeHtml(localizePayment(order.getPaymentMethod())),
                escapeHtml(shipping != null ? localizeShipping(shipping.getShippingMethod()) : "Nincs megadva"),
                itemsHtml.toString(),
                discountBlock.toString(),
                netTotal,
                vatTotal,
                finalGrossTotal
        );
    }
}
