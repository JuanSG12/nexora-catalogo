# Créditos de imágenes

Las fotos de portada de 11 de los 15 dispositivos del catálogo son fotografías
reales obtenidas de Wikimedia Commons bajo licencia libre (verificada
individualmente en la página de cada archivo). Se requiere atribución al autor
original, la cual se deja aquí. Las vistas de "Ángulo" y "Posterior" de la
galería, y la foto de portada de los 4 dispositivos restantes, son renders
vectoriales ilustrados generados para este proyecto (ver
`backend/src/database/generarImagenes.js`), no fotografías reales.

| Dispositivo | Autor | Licencia | Fuente |
|---|---|---|---|
| Galaxy S24 Ultra | Dinkun Chen | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:SAMSUNG_Galaxy_S24_Ultra_(2).jpg |
| Galaxy A55 | Captainmorlypogi1959 | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_A55_5G_2024.jpg |
| iPhone 15 Pro Max | Ayamano2021 | CC-BY-4.0 | https://commons.wikimedia.org/wiki/File:Front_of_iPhone_15_Pro_Max.jpg |
| iPhone 14 | Meido Riyo | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:IPhone_14_20240225.jpg |
| Xiaomi 14 | Kayano Futaba | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:Xiaomi_14_(July_10,_2026).jpg |
| Pixel 8 | IXTA9839 | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:Google_Pixel_8_Rose_front.jpg |
| MacBook Pro 14" M3 | Kyu3a | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:M3_Macbook_Pro_14_inch_Space_Grey_model.jpg |
| ThinkPad X1 Carbon | Dean Calma | CC-BY-2.0 | https://commons.wikimedia.org/wiki/File:ThinkPad_X1_Carbon_gen7_(1).jpg |
| HP Pavilion 15 | Dienthoaiquangcao62 | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:HP_Pavilion_15_cs3095nr.jpg |
| ZenBook 14 OLED | Tech Savvy User | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:Zenbook_S_14_UX5406SA_Product_photo_3W_Scandinavian_White_08.jpg |
| Dell XPS 13 | Green-Curtain | CC-BY-SA-4.0 | https://commons.wikimedia.org/wiki/File:Dell_XPS_13_9350.jpg |

## Notas sobre variantes

Wikimedia Commons no tiene fotos libres del modelo exacto para todos los
dispositivos; en esos casos se usó la variante más cercana disponible con
licencia libre:

- ThinkPad X1 Carbon: la foto es de la generación 7 (gen7), no la última generación.
- HP Pavilion 15: variante específica cs3095nr.
- ZenBook 14 OLED: la foto es del ASUS ZenBook S 14 (UX5406SA), un modelo hermano de la misma línea, no el "14 OLED" exacto.
- Dell XPS 13: la foto es de la variante 9350.
- Xiaomi 14: fotografía de aficionado (no hay fotos de estudio libres disponibles).

## Dispositivos sin foto real disponible

Para estos 4 dispositivos no se encontró en Wikimedia Commons ninguna
fotografía real con licencia libre que muestre el producto de forma clara y
aceptable, así que conservan el render ilustrado como portada:

- Redmi Note 13 Pro: Commons solo tiene fotos de fachadas de tiendas y fotos "tomadas con" el teléfono (no del teléfono).
- IdeaPad Slim 5: Commons solo tiene videos de desensamblaje, sin fotografías.
- Moto Edge 40: la única foto libre disponible mostraba dos dispositivos distintos sobre una vitrina de tienda con mucho texto/desorden, y era del modelo "Edge 40 Neo" (variante distinta) — se descartó por baja calidad visual para el catálogo.
- MacBook Air M3: la única foto libre disponible era una foto de comparación de hardware junto a un dispositivo no relacionado (MNT Pocket Reform), poco clara como foto de producto — se descartó por baja calidad visual para el catálogo.

El manifiesto completo de la búsqueda (incluyendo los casos descartados) está en
`frontend/assets/img/devices/fotos-reales/manifest.json`.
