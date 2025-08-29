package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.ItemDTO;
import com.pahanaedu.billingapp.model.Item;
import com.pahanaedu.billingapp.repository.ItemRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/items")
public class ItemRestController {

    private final ItemRepository repo;

    public ItemRestController(ItemRepository repo) {
        this.repo = repo;
    }

    // GET /api/v1/items?page=0&size=12&q=pen&category=Fiction
    @GetMapping
    public Page<Item> list(@RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "12") int size,
                           @RequestParam(defaultValue = "") String q,
                           @RequestParam(required = false) String category) {
        Pageable pageable = PageRequest.of(page, size);
        return repo.search(category, q, pageable);
    }

    // GET /api/v1/items/categories - get all unique categories
    @GetMapping("/categories")
    public ResponseEntity<java.util.List<String>> getCategories() {
        java.util.List<String> categories = repo.findDistinctCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getOne(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // CREATE (ADMIN/STAFF)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Item> create(@Valid @RequestBody ItemDTO dto) {
        Item item = new Item();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setStock(dto.getStock() == null ? 0 : dto.getStock());
        item.setCategory(dto.getCategory());               // <--- map category
        item.setImageUrl(dto.getImageUrl());               // <--- map imageUrl
        item.setLanguage(dto.getLanguage());               // <--- map language
        item.setBookType(dto.getBookType());               // <--- map bookType
        Item saved = repo.save(item);
        return ResponseEntity.ok(saved);
    }

    // UPDATE (ADMIN/STAFF)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Item> update(@PathVariable Long id, @Valid @RequestBody ItemDTO dto) {
        return repo.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setDescription(dto.getDescription());
            existing.setPrice(dto.getPrice());
            existing.setStock(dto.getStock() == null ? existing.getStock() : dto.getStock());
            existing.setCategory(dto.getCategory());       // <--- map category
            existing.setImageUrl(dto.getImageUrl());       // <--- map imageUrl
            existing.setLanguage(dto.getLanguage());       // <--- map language
            existing.setBookType(dto.getBookType());       // <--- map bookType
            return ResponseEntity.ok(repo.save(existing));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Optional: CORS preflight (only if you haven't set global CORS)
    @RequestMapping(method = RequestMethod.OPTIONS, path = "/**")
    public ResponseEntity<Void> corsPreflight() { return ResponseEntity.ok().build(); }
}
