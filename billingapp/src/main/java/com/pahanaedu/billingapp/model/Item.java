package com.pahanaedu.billingapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "item") // optional but nice
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String name;

    @Column(length = 2000)
    private String description;

    // keep existing DB columns; API will map to these
    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "stock", nullable = false)
    private int stock;

    // NEW: category
    @Column(length = 60)
    private String category;

    // NEW: image URL
    @Column(length = 500)
    private String imageUrl;

    // NEW: language
    @Column(length = 50)
    private String language;

    // NEW: book type (Fiction, Non-Fiction, Novel, Short Story, etc.)
    @Column(length = 100)
    private String bookType;

    public Item() {}

    public Item(String name, String description, double price, int stock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getBookType() { return bookType; }
    public void setBookType(String bookType) { this.bookType = bookType; }
}
