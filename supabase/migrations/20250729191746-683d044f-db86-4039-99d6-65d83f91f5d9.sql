-- Lösche alle abhängigen Daten zuerst
DELETE FROM reviews;
DELETE FROM photos;
DELETE FROM videos;
DELETE FROM events;
DELETE FROM ai_recommendations;

-- Dann lösche alle bestehenden Aktivitäten
DELETE FROM activities;

-- Importiere die neuen CSV-Daten
INSERT INTO activities (
  title, 
  description, 
  location, 
  type, 
  age_range, 
  price_range, 
  opening_hours, 
  website_url, 
  coordinates, 
  created_at, 
  updated_at,
  is_verified,
  is_business
) VALUES 
('Zoo Berlin', 'Der Zoo Berlin ist einer der artenreichsten Zoos der Welt und ein beliebtes Ausflugsziel für Familien.', 'Hardenbergplatz 8, 10787 Berlin', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.zoo-berlin.de/', ST_Point(13.337, 52.5074), now(), now(), true, false),
('Tierpark Hagenbeck Hamburg', 'Hagenbecks Tierpark ist der erste gitterlose Zoo der Welt und bietet naturnahe Tiererlebnisse.', 'Lokstedter Grenzstraße 2, 22527 Hamburg', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.hagenbeck.de/', ST_Point(9.9347, 53.6103), now(), now(), true, false),
('Münchener Tierpark Hellabrunn', 'Der erste Geo-Zoo der Welt mit Tieren aus aller Welt in naturnahen Lebensräumen.', 'Tierparkstraße 30, 81543 München', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.hellabrunn.de/', ST_Point(11.5581, 48.0983), now(), now(), true, false),
('Deutsches Museum München', 'Das größte naturwissenschaftlich-technische Museum der Welt mit interaktiven Exponaten.', 'Museumsinsel 1, 80538 München', ARRAY['museum'], ARRAY['7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-17:00', 'https://www.deutsches-museum.de/', ST_Point(11.5836, 48.1298), now(), now(), true, false),
('Naturkundemuseum Berlin', 'Eines der bedeutendsten Naturkundemuseen weltweit mit dem größten Dinosaurierskelett.', 'Invalidenstraße 43, 10115 Berlin', ARRAY['museum'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Di-Fr 09:30-18:00, Sa-So 10:00-18:00', 'https://www.naturkundemuseum.berlin/', ST_Point(13.3815, 52.5308), now(), now(), true, false),
('Europa-Park Rust', 'Deutschlands größter Freizeitpark mit über 100 Attraktionen und Shows.', 'Europa-Park-Straße 2, 77977 Rust', ARRAY['sport_freizeit'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Saisonal unterschiedlich', 'https://www.europapark.de/', ST_Point(7.7217, 48.2661), now(), now(), true, false),
('Phantasialand Brühl', 'Familienfreizeitpark mit spektakulären Achterbahnen und Themenwelten.', 'Berggeiststraße 31-41, 50321 Brühl', ARRAY['sport_freizeit'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Saisonal unterschiedlich', 'https://www.phantasialand.de/', ST_Point(6.8789, 50.798), now(), now(), true, false),
('Tropical Islands Brandenburg', 'Tropische Erlebniswelt mit Wasserpark, Strand und Regenwald unter einem Dach.', 'Tropical-Islands-Allee 1, 15910 Krausnick', ARRAY['sport_freizeit'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 24h geöffnet', 'https://www.tropical-islands.de/', ST_Point(13.7486, 52.0375), now(), now(), true, false),
('Abenteuerspielplatz Kolle 37 Berlin', 'Großer Abenteuerspielplatz mit Klettergerüsten, Sandkästen und Grünflächen.', 'Kollwitzstraße 37, 10405 Berlin', ARRAY['spielplatz'], ARRAY['4-6', '7-12'], 'kostenlos', 'Mo-So 08:00-20:00', null, ST_Point(13.4127, 52.5321), now(), now(), true, false),
('Spielplatz Englischer Garten München', 'Großer Spielplatz im Englischen Garten mit verschiedenen Spielgeräten.', 'Englischer Garten, 80538 München', ARRAY['spielplatz'], ARRAY['0-3', '4-6', '7-12'], 'kostenlos', 'Mo-So 24h', null, ST_Point(11.6025, 48.1642), now(), now(), true, false),
('Englischer Garten München', 'Einer der größten Stadtparks der Welt mit Biergarten, Spielplätzen und Surfer-Welle.', '80538 München', ARRAY['natur_outdoor'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenlos', 'Mo-So 24h', 'https://www.muenchen.de/', ST_Point(11.6025, 48.1642), now(), now(), true, false),
('Tiergarten Berlin', 'Große Parkanlage im Herzen Berlins mit Spielplätzen, Seen und Spazierwegen.', '10557 Berlin', ARRAY['natur_outdoor'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenlos', 'Mo-So 24h', 'https://www.berlin.de/', ST_Point(13.3501, 52.5145), now(), now(), true, false),
('Miniatur Wunderland Hamburg', 'Die größte Modelleisenbahnanlage der Welt mit detailreichen Miniaturwelten.', 'Kehrwieder 2-4, 20457 Hamburg', ARRAY['kultur'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:30-18:00', 'https://www.miniatur-wunderland.de/', ST_Point(8.9845, 52.4908), now(), now(), true, false),
('Tierpark Berlin', 'Europas größter Landschaftstierpark mit über 9.000 Tieren.', 'Am Tierpark 125, 10319 Berlin', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.tierpark-berlin.de/', ST_Point(13.5317, 52.4975), now(), now(), true, false),
('Kölner Zoo', 'Einer der modernsten Zoos Europas mit über 10.000 Tieren.', 'Riehler Straße 173, 50735 Köln', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.koelnerzoo.de/', ST_Point(6.9722, 50.9583), now(), now(), true, false),
('Senckenberg Museum Frankfurt', 'Eines der größten Naturkundemuseen Deutschlands mit Dinosauriern.', 'Senckenberganlage 25, 60325 Frankfurt', ARRAY['museum'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-17:00', 'https://www.senckenberg.de/', ST_Point(8.6501, 50.1173), now(), now(), true, false),
('Deutsches Technikmuseum Berlin', 'Technikgeschichte zum Anfassen mit Flugzeugen und Lokomotiven.', 'Trebbiner Straße 9, 10963 Berlin', ARRAY['museum'], ARRAY['7-12', '13-17'], 'kostenpflichtig', 'Di-Fr 09:00-17:30, Sa-So 10:00-18:00', 'https://www.sdtb.de/', ST_Point(13.3778, 52.4983), now(), now(), true, false),
('Heide Park Soltau', 'Norddeutschlands größter Freizeitpark mit Achterbahnen.', 'Heide Park 1, 29614 Soltau', ARRAY['sport_freizeit'], ARRAY['7-12', '13-17'], 'kostenpflichtig', 'Saisonal unterschiedlich', 'https://www.heide-park.de/', ST_Point(9.8789, 53.0247), now(), now(), true, false),
('Movie Park Germany', 'Filmthemenpark mit Hollywood-Attraktionen.', 'Warner-Allee 1, 46244 Bottrop', ARRAY['sport_freizeit'], ARRAY['7-12', '13-17'], 'kostenpflichtig', 'Saisonal unterschiedlich', 'https://www.movieparkgermany.de/', ST_Point(6.975, 51.6167), now(), now(), true, false),
('Therme Erding', 'Die größte Therme der Welt mit Rutschen und Wellness.', 'Thermenallee 1-5, 85435 Erding', ARRAY['sport_freizeit'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 10:00-23:00', 'https://www.therme-erding.de/', ST_Point(11.9167, 48.3167), now(), now(), true, false),
('AquaDom & SEA LIFE Berlin', 'Spektakuläres Aquarium mit dem größten zylindrischen Aquarium der Welt.', 'Spandauer Straße 3, 10178 Berlin', ARRAY['sport_freizeit'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 10:00-19:00', 'https://www.visitsealife.com/berlin/', ST_Point(13.405, 52.52), now(), now(), true, false),
('Planten un Blomen Hamburg', 'Botanischer Garten mit Wasserspielen und Spielplätzen.', 'Bei den St. Pauli-Landungsbrücken, 20359 Hamburg', ARRAY['natur_outdoor'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenlos', 'Mo-So 07:00-20:00', 'https://www.hamburg.de/', ST_Point(9.9822, 53.5583), now(), now(), true, false),
('Legoland Deutschland', 'Familienfreizeitpark speziell für Kinder von 2-12 Jahren.', 'Legoland-Allee 1, 89312 Günzburg', ARRAY['sport_freizeit'], ARRAY['4-6', '7-12'], 'kostenpflichtig', 'Saisonal unterschiedlich', 'https://www.legoland.de/', ST_Point(10.2989, 48.4247), now(), now(), true, false),
('Zoo Leipzig', 'Zoo der Zukunft mit naturnahen Erlebniswelten.', 'Pfaffendorfer Straße 29, 04105 Leipzig', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.zoo-leipzig.de/', ST_Point(12.3833, 51.35), now(), now(), true, false),
('Wilhelma Stuttgart', 'Zoologisch-botanischer Garten mit historischen Gebäuden.', 'Wilhelma 13, 70376 Stuttgart', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 08:15-18:00', 'https://www.wilhelma.de/', ST_Point(9.2053, 48.8042), now(), now(), true, false),
('Zoo Hannover', 'Erlebniszoo mit sieben Themenwelten.', 'Adenauerallee 3, 30175 Hannover', ARRAY['zoo_tierpark'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.zoo-hannover.de/', ST_Point(9.7394, 52.3742), now(), now(), true, false),
('Schokoladenmuseum Köln', 'Alles über Schokolade mit Verkostung und Produktion.', 'Am Schokoladenmuseum 1A, 50678 Köln', ARRAY['museum'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 10:00-18:00', 'https://www.schokoladenmuseum.de/', ST_Point(6.965, 50.9317), now(), now(), true, false),
('Kindermuseum München', 'Interaktives Museum speziell für Kinder zum Mitmachen.', 'Arnulfstraße 3, 80335 München', ARRAY['museum'], ARRAY['0-3', '4-6', '7-12'], 'kostenpflichtig', 'Di-So 10:00-17:00', 'https://www.kindermuseum-muenchen.de/', ST_Point(11.5581, 48.145), now(), now(), true, false),
('Mauerpark Berlin', 'Beliebter Park mit Flohmarkt und Karaoke.', 'Gleimstraße 55, 10437 Berlin', ARRAY['natur_outdoor'], ARRAY['4-6', '7-12', '13-17'], 'kostenlos', 'Mo-So 24h', null, ST_Point(13.4022, 52.5408), now(), now(), true, false),
('Tempelhofer Feld', 'Ehemaliger Flughafen, jetzt riesiger Park zum Skaten und Radfahren.', 'Tempelhofer Damm, 12101 Berlin', ARRAY['natur_outdoor'], ARRAY['7-12', '13-17'], 'kostenlos', 'Mo-So 06:00-22:00', null, ST_Point(13.4019, 52.4736), now(), now(), true, false),
('Labyrinth Kindermuseum Berlin', 'Interaktives Museum für Kinder mit wechselnden Ausstellungen.', 'Osloer Straße 12, 13359 Berlin', ARRAY['museum'], ARRAY['0-3', '4-6', '7-12'], 'kostenpflichtig', 'Mo-Fr 09:00-18:00, Sa-So 10:00-18:00', 'https://www.labyrinth-kindermuseum.de/', ST_Point(13.3667, 52.5583), now(), now(), true, false),
('Elbstrand Hamburg', 'Stadtstrand an der Elbe mit Spielplatz und Café.', 'Elbchaussee, 22763 Hamburg', ARRAY['natur_outdoor'], ARRAY['0-3', '4-6', '7-12', '13-17'], 'kostenlos', 'Mo-So 24h', null, ST_Point(9.8833, 53.5511), now(), now(), true, false),
('Trampolin Park Hamburg', 'Indoor-Trampolinpark mit verschiedenen Bereichen.', 'Mexikoring 15, 22297 Hamburg', ARRAY['sport_freizeit'], ARRAY['4-6', '7-12', '13-17'], 'kostenpflichtig', 'Mo-So 10:00-22:00', 'https://www.jumphouse.de/', ST_Point(10.0833, 53.6167), now(), now(), true, false),
('Olympiapark München', 'Olympiagelände von 1972 mit See, Turm und Veranstaltungen.', 'Spiridon-Louis-Ring 21, 80809 München', ARRAY['natur_outdoor'], ARRAY['4-6', '7-12', '13-17'], 'kostenlos', 'Mo-So 24h', 'https://www.olympiapark.de/', ST_Point(11.5506, 48.1742), now(), now(), true, false),
('BMW Welt München', 'Automobilausstellung mit interaktiven Exponaten.', 'Am Olympiapark 2, 80809 München', ARRAY['museum'], ARRAY['7-12', '13-17'], 'kostenlos', 'Mo-So 10:00-18:00', 'https://www.bmw-welt.com/', ST_Point(11.5581, 48.1769), now(), now(), true, false),
('Schloss Neuschwanstein', 'Das berühmte Märchenschloss von König Ludwig II. und Inspiration für Disney-Schlösser.', 'Neuschwansteinstraße 20, 87645 Schwangau', ARRAY['sonstiges'], ARRAY['7-12', '13-17'], 'kostenpflichtig', 'Mo-So 09:00-18:00', 'https://www.neuschwanstein.de/', ST_Point(10.7498, 47.5576), now(), now(), true, false);