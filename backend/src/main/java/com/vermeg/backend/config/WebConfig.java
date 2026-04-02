package com.vermeg.backend.config; // ثبت في اسم الـ package متاعك هوني

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // هوني نقلو: أي URL يبدأ بـ /uploads/ هو في الحقيقة ملف موجود في dossier اسمه uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}