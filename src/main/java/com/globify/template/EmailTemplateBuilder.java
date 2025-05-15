package com.globify.template;

import org.springframework.stereotype.Component;

@Component
public class EmailTemplateBuilder {

    public String buildVerificationEmail(String link) {
        return baseEmailTemplate(
                "Email Megerősítés",
                "Kérlek kattints az alábbi gombra az email címed megerősítéséhez:",
                "Email megerősítése",
                link
        );
    }

    public String buildResetPasswordEmail(String link) {
        return baseEmailTemplate(
                "Jelszó Visszaállítás",
                "Úgy tűnik, elfelejtetted a jelszavad. Kérlek kattints az alábbi gombra a visszaállításhoz:",
                "Jelszó visszaállítása",
                link
        );
    }

    public String buildOrderUpdateEmail(String message, String link) {
        return baseEmailTemplate(
                "Rendelés Frissítés",
                message + "<br><br>Kattints az alábbi gombra a rendelésed megtekintéséhez:",
                "Rendelés megtekintése",
                link
        );
    }

    public String buildNewsletterEmail(String message, String unsubscribeLink, String imageBlock) {
        return String.format("""
        <html>
        <head>
            <meta charset=\"UTF-8\">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f3f8f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                }
                .email-header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2e7d32;
                }
                .email-title {
                    font-size: 24px;
                    color: #2e7d32;
                    margin-bottom: 16px;
                }
                .email-body {
                    font-size: 16px;
                    color: #444;
                    line-height: 1.6;
                    text-align: center;
                }
                .product-button {
                    display: inline-block;
                    margin-top: 24px;
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: #ffffff !important;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                }
                .unsubscribe {
                    margin-top: 32px;
                    font-size: 13px;
                    color: #999;
                    text-align: center;
                }
                .email-footer {
                    margin-top: 24px;
                    font-size: 12px;
                    color: #999;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class=\"email-container\">
                <div class=\"email-header\">
                    <div class=\"logo\">🌿 Globify</div>
                    <div class=\"email-title\">Hírlevél</div>
                </div>
                <div class=\"email-body\">
                    <p>Kedves Olvasónk!</p>
                    <p>%s</p>
                    %s
                    <a href=\"https://jsglobal.hu/products?category=new\" class=\"product-button\">Termékek megtekintése</a>
                </div>
                <div class=\"unsubscribe\">
                    <p><a href=\"%s\">Leiratkozás a hírlevélről</a></p>
                </div>
                <div class=\"email-footer\">
                    <p>Ha bármilyen kérdésed van: support@globify.com</p>
                    <p>Üdvözlettel,<br>Globify Csapat</p>
                </div>
            </div>
        </body>
        </html>
        """, message, imageBlock, unsubscribeLink);
    }

    public String buildGuestCartLinkEmail(String link) {
        return baseEmailTemplate(
                "Rendelés folytatása vendégként",
                "Kosarad megmaradt! Kattints az alábbi gombra, hogy folytasd a rendelést vendégként:",
                "Rendelés folytatása",
                link
        );
    }

    private String baseEmailTemplate(String title, String bodyText, String buttonText, String buttonUrl) {
        return String.format("""
        <html>
        <head>
            <meta charset=\"UTF-8\">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f3f8f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                }
                .email-header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2e7d32;
                }
                .email-title {
                    font-size: 24px;
                    color: #2e7d32;
                    margin-bottom: 16px;
                }
                .email-body {
                    font-size: 16px;
                    color: #444;
                    line-height: 1.6;
                    text-align: center;
                }
                .cta-button {
                    display: inline-block;
                    margin-top: 24px;
                    padding: 12px 24px;
                    background-color: #388e3c;
                    color: #ffffff !important;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                }
                .email-footer {
                    margin-top: 32px;
                    font-size: 12px;
                    color: #999;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class=\"email-container\">
                <div class=\"email-header\">
                    <div class=\"logo\">🌿 Globify</div>
                    <div class=\"email-title\">%s</div>
                </div>
                <div class=\"email-body\">
                    <p>%s</p>
                    <a href=\"%s\" class=\"cta-button\">%s</a>
                </div>
                <div class=\"email-footer\">
                    <p>Üdvözlettel,<br>Globify Csapat</p>
                    <p>support@globify.com</p>
                </div>
            </div>
        </body>
        </html>
        """, title, bodyText, buttonUrl, buttonText);
    }

}
