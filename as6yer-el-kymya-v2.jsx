import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   COMPLETE 118-ELEMENT DATA
═══════════════════════════════════════════════════════════════ */
const ELEMENTS = [
  {n:1,  sym:"H",  name:"Hydrogen",      mass:1.008,   cat:"nonmetal",   period:1,group:1,  phase:"Gas",   block:"s", config:"1s¹",         en:2.20, mp:-259.1, bp:-252.9, density:0.0899, radius:53,  discovery:1766, by:"Henry Cavendish",    uses:"Fuel cells, ammonia production, hydrogenation",                          hazard:"Highly flammable, explosion risk",              fact:"Most abundant element in the universe (75% of all matter)"},
  {n:2,  sym:"He", name:"Helium",        mass:4.003,   cat:"noble",      period:1,group:18, phase:"Gas",   block:"s", config:"1s²",         en:null, mp:-272.2, bp:-268.9, density:0.1786, radius:31,  discovery:1868, by:"Janssen & Lockyer",  uses:"Balloons, MRI machines, cryogenics, welding",                            hazard:"Asphyxiant in high concentrations",             fact:"Discovered in the Sun before Earth"},
  {n:3,  sym:"Li", name:"Lithium",       mass:6.941,   cat:"alkali",     period:2,group:1,  phase:"Solid", block:"s", config:"[He] 2s¹",    en:0.98, mp:180.5,  bp:1342,   density:0.534,  radius:167, discovery:1817, by:"Johan Arfwedson",    uses:"Lithium-ion batteries, psychiatric medication, alloys",                   hazard:"Reacts violently with water",                   fact:"Lightest solid metal — floats on water"},
  {n:4,  sym:"Be", name:"Beryllium",     mass:9.012,   cat:"alkaline",   period:2,group:2,  phase:"Solid", block:"s", config:"[He] 2s²",    en:1.57, mp:1287,   bp:2470,   density:1.85,   radius:112, discovery:1798, by:"Louis-Nicolas Vauquelin", uses:"X-ray windows, aerospace structures, nuclear reactors",                hazard:"Toxic — causes berylliosis (lung disease)",     fact:"Extremely stiff: 6× stiffer than steel"},
  {n:5,  sym:"B",  name:"Boron",         mass:10.81,   cat:"metalloid",  period:2,group:13, phase:"Solid", block:"p", config:"[He] 2s²2p¹", en:2.04, mp:2076,   bp:3927,   density:2.34,   radius:87,  discovery:1808, by:"Gay-Lussac & Thenard",uses:"Borosilicate glass, semiconductors, nuclear control rods",               hazard:"Low toxicity; dust is irritant",                fact:"Found naturally in borax, used since ancient Egypt"},
  {n:6,  sym:"C",  name:"Carbon",        mass:12.011,  cat:"nonmetal",   period:2,group:14, phase:"Solid", block:"p", config:"[He] 2s²2p²", en:2.55, mp:3642,   bp:3642,   density:2.267,  radius:77,  discovery:null, by:"Ancient",            uses:"Steel, diamonds, graphite, organic chemistry, life itself",               hazard:"CO gas is deadly (carbon monoxide poisoning)",  fact:"Basis of all known life; forms more compounds than any other element"},
  {n:7,  sym:"N",  name:"Nitrogen",      mass:14.007,  cat:"nonmetal",   period:2,group:15, phase:"Gas",   block:"p", config:"[He] 2s²2p³", en:3.04, mp:-210.0, bp:-195.8, density:1.251,  radius:75,  discovery:1772, by:"Daniel Rutherford",  uses:"Fertilizers (Haber process), explosives, food packaging",                hazard:"Liquid nitrogen causes severe frostbite",       fact:"Makes up 78% of Earth's atmosphere"},
  {n:8,  sym:"O",  name:"Oxygen",        mass:15.999,  cat:"nonmetal",   period:2,group:16, phase:"Gas",   block:"p", config:"[He] 2s²2p⁴", en:3.44, mp:-218.4, bp:-182.9, density:1.429,  radius:73,  discovery:1774, by:"Carl Wilhelm Scheele",uses:"Respiration, steel production, water treatment, medicine",                hazard:"Supports and accelerates combustion",           fact:"Third most abundant element in the universe"},
  {n:9,  sym:"F",  name:"Fluorine",      mass:18.998,  cat:"halogen",    period:2,group:17, phase:"Gas",   block:"p", config:"[He] 2s²2p⁵", en:3.98, mp:-219.6, bp:-188.1, density:1.696,  radius:64,  discovery:1886, by:"Henri Moissan",      uses:"Toothpaste (fluoride), Teflon, refrigerants, uranium processing",        hazard:"Most reactive nonmetal — extremely corrosive",  fact:"Highest electronegativity of all elements"},
  {n:10, sym:"Ne", name:"Neon",          mass:20.18,   cat:"noble",      period:2,group:18, phase:"Gas",   block:"p", config:"[He] 2s²2p⁶", en:null, mp:-248.6, bp:-246.1, density:0.9002, radius:58,  discovery:1898, by:"Ramsay & Travers",   uses:"Neon signs, lasers, cryogenics, lightning arrestors",                    hazard:"Asphyxiant in large quantities",                fact:"Named from Greek 'neos' meaning new"},
  {n:11, sym:"Na", name:"Sodium",        mass:22.990,  cat:"alkali",     period:3,group:1,  phase:"Solid", block:"s", config:"[Ne] 3s¹",    en:0.93, mp:97.72,  bp:883,    density:0.968,  radius:190, discovery:1807, by:"Humphry Davy",       uses:"Table salt, soap manufacturing, street lighting, medicine",               hazard:"Explodes violently when in contact with water",  fact:"Essential for nerve impulse transmission"},
  {n:12, sym:"Mg", name:"Magnesium",     mass:24.305,  cat:"alkaline",   period:3,group:2,  phase:"Solid", block:"s", config:"[Ne] 3s²",    en:1.31, mp:650,    bp:1091,   density:1.738,  radius:145, discovery:1755, by:"Joseph Black",       uses:"Lightweight alloys, fireworks, antacids, chlorophyll in plants",         hazard:"Burns with intense white flame, even underwater",fact:"Key component of chlorophyll (plant photosynthesis)"},
  {n:13, sym:"Al", name:"Aluminum",      mass:26.982,  cat:"post-trans", period:3,group:13, phase:"Solid", block:"p", config:"[Ne] 3s²3p¹", en:1.61, mp:660.3,  bp:2519,   density:2.698,  radius:118, discovery:1825, by:"Hans Christian Ørsted",uses:"Aircraft, cans, foil, construction, electrical wiring",                 hazard:"Dust is explosive; linked to Alzheimer research",fact:"Most abundant metal in Earth's crust"},
  {n:14, sym:"Si", name:"Silicon",       mass:28.085,  cat:"metalloid",  period:3,group:14, phase:"Solid", block:"p", config:"[Ne] 3s²3p²", en:1.90, mp:1414,   bp:3265,   density:2.329,  radius:111, discovery:1824, by:"Jöns Jacob Berzelius",uses:"Computer chips, solar cells, glass, concrete",                           hazard:"Silica dust causes silicosis (lung disease)",   fact:"Second most abundant element in Earth's crust"},
  {n:15, sym:"P",  name:"Phosphorus",    mass:30.974,  cat:"nonmetal",   period:3,group:15, phase:"Solid", block:"p", config:"[Ne] 3s²3p³", en:2.19, mp:44.2,   bp:280.5,  density:1.823,  radius:98,  discovery:1669, by:"Hennig Brand",       uses:"Fertilizers, matches, DNA/RNA backbone, detergents",                     hazard:"White phosphorus self-ignites spontaneously",   fact:"Essential component of DNA, RNA, and ATP"},
  {n:16, sym:"S",  name:"Sulfur",        mass:32.06,   cat:"nonmetal",   period:3,group:16, phase:"Solid", block:"p", config:"[Ne] 3s²3p⁴", en:2.58, mp:115.2,  bp:444.6,  density:2.067,  radius:103, discovery:null, by:"Ancient",            uses:"Sulfuric acid, gunpowder, rubber vulcanization, medicine",                hazard:"SO₂ is toxic; acid rain contributor",           fact:"Known and used since ancient times (biblical 'brimstone')"},
  {n:17, sym:"Cl", name:"Chlorine",      mass:35.45,   cat:"halogen",    period:3,group:17, phase:"Gas",   block:"p", config:"[Ne] 3s²3p⁵", en:3.16, mp:-101.5, bp:-34.05, density:3.214,  radius:99,  discovery:1774, by:"Carl Wilhelm Scheele",uses:"Water purification, PVC plastic, bleach, pharmaceuticals",               hazard:"Toxic gas — used as chemical weapon in WWI",    fact:"Makes seawater taste salty (as NaCl)"},
  {n:18, sym:"Ar", name:"Argon",         mass:39.948,  cat:"noble",      period:3,group:18, phase:"Gas",   block:"p", config:"[Ne] 3s²3p⁶", en:null, mp:-189.4, bp:-185.9, density:1.784,  radius:71,  discovery:1894, by:"Rayleigh & Ramsay",  uses:"Welding shield gas, light bulbs, wine preservation, lasers",             hazard:"Asphyxiant — displaces oxygen in enclosed spaces",fact:"Makes up 0.93% of Earth's atmosphere"},
  {n:19, sym:"K",  name:"Potassium",     mass:39.098,  cat:"alkali",     period:4,group:1,  phase:"Solid", block:"s", config:"[Ar] 4s¹",    en:0.82, mp:63.38,  bp:759,    density:0.862,  radius:243, discovery:1807, by:"Humphry Davy",       uses:"Fertilizers, gunpowder, food additive, blood pressure regulation",       hazard:"Reacts violently with water",                   fact:"Essential for heart function and nerve signals"},
  {n:20, sym:"Ca", name:"Calcium",       mass:40.078,  cat:"alkaline",   period:4,group:2,  phase:"Solid", block:"s", config:"[Ar] 4s²",    en:1.00, mp:842,    bp:1484,   density:1.54,   radius:194, discovery:1808, by:"Humphry Davy",       uses:"Bones, cement, chalk, cheese, antacids, construction",                   hazard:"Reacts with water; irritant",                   fact:"5th most abundant element in Earth's crust"},
  {n:21, sym:"Sc", name:"Scandium",      mass:44.956,  cat:"transition", period:4,group:3,  phase:"Solid", block:"d", config:"[Ar] 3d¹4s²", en:1.36, mp:1541,   bp:2836,   density:2.985,  radius:184, discovery:1879, by:"Lars Fredrik Nilson",uses:"Aerospace alloys, sports equipment, metal halide lamps",                  hazard:"Low toxicity",                                  fact:"Predicted by Mendeleev before discovery"},
  {n:22, sym:"Ti", name:"Titanium",      mass:47.867,  cat:"transition", period:4,group:4,  phase:"Solid", block:"d", config:"[Ar] 3d²4s²", en:1.54, mp:1668,   bp:3287,   density:4.506,  radius:176, discovery:1791, by:"William Gregor",     uses:"Jet engines, medical implants, sunscreen (TiO₂), spacecraft",           hazard:"Dust is flammable",                             fact:"As strong as steel but 45% lighter"},
  {n:23, sym:"V",  name:"Vanadium",      mass:50.942,  cat:"transition", period:4,group:5,  phase:"Solid", block:"d", config:"[Ar] 3d³4s²", en:1.63, mp:1910,   bp:3407,   density:6.11,   radius:171, discovery:1801, by:"Andrés Manuel del Río",uses:"Steel alloys, vanadium redox batteries, catalysts",                     hazard:"Vanadium compounds are toxic",                  fact:"Named after Vanadis (Norse goddess Freya)"},
  {n:24, sym:"Cr", name:"Chromium",      mass:51.996,  cat:"transition", period:4,group:6,  phase:"Solid", block:"d", config:"[Ar] 3d⁵4s¹", en:1.66, mp:1907,   bp:2671,   density:7.15,   radius:166, discovery:1798, by:"Louis-Nicolas Vauquelin",uses:"Stainless steel, chrome plating, pigments, leather tanning",             hazard:"Cr(VI) is a carcinogen",                        fact:"Makes rubies red and emeralds green"},
  {n:25, sym:"Mn", name:"Manganese",     mass:54.938,  cat:"transition", period:4,group:7,  phase:"Solid", block:"d", config:"[Ar] 3d⁵4s²", en:1.55, mp:1246,   bp:2061,   density:7.21,   radius:161, discovery:1774, by:"Johan Gottlieb Gahn",uses:"Steel production, dry cell batteries, purple glass",                     hazard:"Manganism (neurological disorder) from overexposure",fact:"Essential trace element for enzyme function"},
  {n:26, sym:"Fe", name:"Iron",          mass:55.845,  cat:"transition", period:4,group:8,  phase:"Solid", block:"d", config:"[Ar] 3d⁶4s²", en:1.83, mp:1538,   bp:2861,   density:7.874,  radius:156, discovery:null, by:"Ancient",            uses:"Steel, construction, hemoglobin (blood), cast iron",                     hazard:"Iron oxide dust is a lung irritant",            fact:"Earth's core is primarily solid iron"},
  {n:27, sym:"Co", name:"Cobalt",        mass:58.933,  cat:"transition", period:4,group:9,  phase:"Solid", block:"d", config:"[Ar] 3d⁷4s²", en:1.88, mp:1495,   bp:2927,   density:8.90,   radius:152, discovery:1735, by:"Georg Brandt",       uses:"Lithium-ion batteries, blue pigments, magnets, alloys",                  hazard:"Radioactive Co-60 used in cancer therapy",      fact:"Gives blue color to glass and ceramics"},
  {n:28, sym:"Ni", name:"Nickel",        mass:58.693,  cat:"transition", period:4,group:10, phase:"Solid", block:"d", config:"[Ar] 3d⁸4s²", en:1.91, mp:1455,   bp:2913,   density:8.908,  radius:149, discovery:1751, by:"Axel Fredrik Cronstedt",uses:"Stainless steel, coins, rechargeable batteries, magnets",                hazard:"Nickel compounds are carcinogenic",              fact:"Coins get their silver color from nickel"},
  {n:29, sym:"Cu", name:"Copper",        mass:63.546,  cat:"transition", period:4,group:11, phase:"Solid", block:"d", config:"[Ar] 3d¹⁰4s¹",en:1.90, mp:1084.6, bp:2562,   density:8.960,  radius:145, discovery:null, by:"Ancient",            uses:"Electrical wiring, plumbing, coins, antimicrobial surfaces",             hazard:"Toxic to aquatic life in excess",               fact:"First metal used by humans (~10,000 years ago)"},
  {n:30, sym:"Zn", name:"Zinc",          mass:65.38,   cat:"transition", period:4,group:12, phase:"Solid", block:"d", config:"[Ar] 3d¹⁰4s²",en:1.65, mp:419.5,  bp:907,    density:7.134,  radius:142, discovery:1746, by:"Andreas Sigismund Marggraf",uses:"Galvanizing, sunscreen (ZnO), die casting, dietary supplement",        hazard:"Zinc fume fever from inhalation",               fact:"Essential mineral for immune system function"},
  {n:31, sym:"Ga", name:"Gallium",       mass:69.723,  cat:"post-trans", period:4,group:13, phase:"Solid", block:"p", config:"[Ar] 3d¹⁰4s²4p¹",en:1.81,mp:29.76, bp:2204,   density:5.91,   radius:136, discovery:1875, by:"Paul Emile Lecoq de Boisbaudran",uses:"LEDs, semiconductors, solar cells, thermometers",                 hazard:"Low toxicity",                                  fact:"Melts in your hand (mp = 29.76°C)"},
  {n:32, sym:"Ge", name:"Germanium",     mass:72.630,  cat:"metalloid",  period:4,group:14, phase:"Solid", block:"p", config:"[Ar] 3d¹⁰4s²4p²",en:2.01,mp:938.2, bp:2833,   density:5.323,  radius:125, discovery:1886, by:"Clemens Winkler",   uses:"Fiber optics, infrared optics, semiconductors",                          hazard:"Low toxicity",                                  fact:"Predicted by Mendeleev as 'eka-silicon'"},
  {n:33, sym:"As", name:"Arsenic",       mass:74.922,  cat:"metalloid",  period:4,group:15, phase:"Solid", block:"p", config:"[Ar] 3d¹⁰4s²4p³",en:2.18,mp:817,   bp:614,    density:5.727,  radius:114, discovery:1250, by:"Albertus Magnus",   uses:"Semiconductors, wood preservatives, pesticides",                         hazard:"Highly toxic — classic poison in history",      fact:"Used as a cosmetic poison in Victorian England"},
  {n:34, sym:"Se", name:"Selenium",      mass:78.971,  cat:"nonmetal",   period:4,group:16, phase:"Solid", block:"p", config:"[Ar] 3d¹⁰4s²4p⁴",en:2.55,mp:221,   bp:685,    density:4.809,  radius:103, discovery:1817, by:"Jöns Jacob Berzelius",uses:"Glass manufacturing, photocopiers, dietary supplement",                 hazard:"Toxic in high doses",                           fact:"Essential trace element — found in Brazil nuts"},
  {n:35, sym:"Br", name:"Bromine",       mass:79.904,  cat:"halogen",    period:4,group:17, phase:"Liquid",block:"p", config:"[Ar] 3d¹⁰4s²4p⁵",en:2.96,mp:-7.2,  bp:58.9,   density:3.122,  radius:94,  discovery:1826, by:"Antoine Jérôme Balard",uses:"Flame retardants, photography, water treatment",                       hazard:"Corrosive liquid, toxic vapors",                fact:"One of only two elements that is liquid at room temperature"},
  {n:36, sym:"Kr", name:"Krypton",       mass:83.798,  cat:"noble",      period:4,group:18, phase:"Gas",   block:"p", config:"[Ar] 3d¹⁰4s²4p⁶",en:null,mp:-157.4,bp:-153.2, density:3.749,  radius:88,  discovery:1898, by:"Ramsay & Travers",  uses:"Fluorescent lights, flash photography, laser systems",                   hazard:"Asphyxiant",                                    fact:"Named from Greek 'kryptos' meaning hidden"},
  {n:37, sym:"Rb", name:"Rubidium",      mass:85.468,  cat:"alkali",     period:5,group:1,  phase:"Solid", block:"s", config:"[Kr] 5s¹",    en:0.82, mp:39.31,  bp:688,    density:1.532,  radius:265, discovery:1861, by:"Bunsen & Kirchhoff", uses:"Atomic clocks, GPS, medical imaging, fireworks",                         hazard:"Reacts violently with water and air",           fact:"Used in most accurate atomic clocks"},
  {n:38, sym:"Sr", name:"Strontium",     mass:87.62,   cat:"alkaline",   period:5,group:2,  phase:"Solid", block:"s", config:"[Kr] 5s²",    en:0.95, mp:777,    bp:1382,   density:2.64,   radius:219, discovery:1790, by:"Adair Crawford",     uses:"Fireworks (red color), medical bone treatments, CRT displays",           hazard:"Radioactive Sr-90 is a serious health hazard",  fact:"Gives fireworks their brilliant crimson red color"},
  {n:39, sym:"Y",  name:"Yttrium",       mass:88.906,  cat:"transition", period:5,group:3,  phase:"Solid", block:"d", config:"[Kr] 4d¹5s²", en:1.22, mp:1522,   bp:3345,   density:4.472,  radius:212, discovery:1794, by:"Johan Gadolin",      uses:"LED phosphors, superconductors, camera lenses",                          hazard:"Irritant",                                      fact:"Named after Ytterby, a village in Sweden"},
  {n:40, sym:"Zr", name:"Zirconium",     mass:91.224,  cat:"transition", period:5,group:4,  phase:"Solid", block:"d", config:"[Kr] 4d²5s²", en:1.33, mp:1855,   bp:4409,   density:6.52,   radius:206, discovery:1789, by:"Martin Heinrich Klaproth",uses:"Nuclear reactor cladding, ceramics, cubic zirconia gems",             hazard:"Dust is flammable",                             fact:"Almost transparent to neutrons — ideal for nuclear use"},
  {n:47, sym:"Ag", name:"Silver",        mass:107.868, cat:"transition", period:5,group:11, phase:"Solid", block:"d", config:"[Kr] 4d¹⁰5s¹",en:1.93, mp:961.8,  bp:2162,   density:10.49,  radius:165, discovery:null, by:"Ancient",            uses:"Jewelry, photography, electronics, antimicrobial coatings",               hazard:"Argyria (skin turns blue) from excess ingestion", fact:"Best electrical and thermal conductor of all metals"},
  {n:50, sym:"Sn", name:"Tin",           mass:118.71,  cat:"post-trans", period:5,group:14, phase:"Solid", block:"p", config:"[Kr] 4d¹⁰5s²5p²",en:1.96,mp:231.9, bp:2602,   density:7.265,  radius:145, discovery:null, by:"Ancient",            uses:"Tin cans, solder, bronze alloys, organotin compounds",                   hazard:"Organotin compounds are toxic",                 fact:"Has the most stable isotopes of any element (10)"},
  {n:53, sym:"I",  name:"Iodine",        mass:126.904, cat:"halogen",    period:5,group:17, phase:"Solid", block:"p", config:"[Kr] 4d¹⁰5s²5p⁵",en:2.66,mp:113.5, bp:184.3,  density:4.933,  radius:133, discovery:1811, by:"Bernard Courtois",  uses:"Antiseptics, thyroid medication, photography, nutrition",                 hazard:"Toxic in large doses; radioactive I-131 from nuclear fallout",fact:"Essential for thyroid hormone production"},
  {n:54, sym:"Xe", name:"Xenon",         mass:131.293, cat:"noble",      period:5,group:18, phase:"Gas",   block:"p", config:"[Kr] 4d¹⁰5s²5p⁶",en:null,mp:-111.8,bp:-108.0, density:5.894,  radius:108, discovery:1898, by:"Ramsay & Travers",  uses:"Flash lamps, ion thrusters, anesthesia, NMR spectroscopy",               hazard:"Anesthetic at high pressures",                  fact:"Can form chemical compounds despite being 'noble'"},
  {n:56, sym:"Ba", name:"Barium",        mass:137.327, cat:"alkaline",   period:6,group:2,  phase:"Solid", block:"s", config:"[Xe] 6s²",    en:0.89, mp:727,    bp:1897,   density:3.51,   radius:253, discovery:1808, by:"Humphry Davy",       uses:"Barium sulfate (X-ray contrast), fireworks (green), oil drilling",       hazard:"Soluble barium compounds are toxic",            fact:"Used to give fireworks their brilliant green color"},
  {n:74, sym:"W",  name:"Tungsten",      mass:183.84,  cat:"transition", period:6,group:6,  phase:"Solid", block:"d", config:"[Xe] 4f¹⁴5d⁴6s²",en:2.36,mp:3422,  bp:5555,   density:19.25,  radius:193, discovery:1783, by:"Juan José & Fausto Elhuyar",uses:"Incandescent bulb filaments, cutting tools, X-ray targets",           hazard:"Tungsten compounds may be toxic",               fact:"Highest melting point of all metals (3422°C)"},
  {n:78, sym:"Pt", name:"Platinum",      mass:195.084, cat:"transition", period:6,group:10, phase:"Solid", block:"d", config:"[Xe] 4f¹⁴5d⁹6s¹",en:2.28,mp:1768,  bp:3825,   density:21.45,  radius:177, discovery:1735, by:"Antonio de Ulloa",  uses:"Catalytic converters, jewelry, lab equipment, chemotherapy drugs",       hazard:"Some compounds are toxic",                      fact:"World's smallest measurable quantity — the kilogram was defined by a Pt block"},
  {n:79, sym:"Au", name:"Gold",          mass:196.967, cat:"transition", period:6,group:11, phase:"Solid", block:"d", config:"[Xe] 4f¹⁴5d¹⁰6s¹",en:2.54,mp:1064,  bp:2856,   density:19.30,  radius:174, discovery:null, by:"Ancient",            uses:"Jewelry, electronics, dentistry, currency reserve",                       hazard:"Nearly non-toxic",                              fact:"So rare — all mined gold fits in a 21m cube"},
  {n:80, sym:"Hg", name:"Mercury",       mass:200.592, cat:"transition", period:6,group:12, phase:"Liquid",block:"d", config:"[Xe] 4f¹⁴5d¹⁰6s²",en:2.00,mp:-38.8, bp:356.7,  density:13.534, radius:171, discovery:null, by:"Ancient",            uses:"Thermometers, fluorescent lights, dental amalgams, switches",             hazard:"Neurotoxin — accumulates in food chain",        fact:"Only metal that is liquid at room temperature"},
  {n:82, sym:"Pb", name:"Lead",          mass:207.2,   cat:"post-trans", period:6,group:14, phase:"Solid", block:"p", config:"[Xe] 4f¹⁴5d¹⁰6s²6p²",en:2.33,mp:327.5,bp:1749,  density:11.34,  radius:202, discovery:null, by:"Ancient",            uses:"Batteries, radiation shielding, ammunition, old plumbing",                hazard:"Severe neurotoxin, especially dangerous to children",fact:"Romans used lead pipes extensively (possibly contributing to decline)"},
  {n:86, sym:"Rn", name:"Radon",         mass:222,     cat:"noble",      period:6,group:18, phase:"Gas",   block:"p", config:"[Xe] 4f¹⁴5d¹⁰6s²6p⁶",en:null,mp:-71,  bp:-61.7,  density:9.73,   radius:120, discovery:1900, by:"Friedrich Ernst Dorn",uses:"Cancer radiation therapy, earthquake prediction",                       hazard:"Radioactive — second leading cause of lung cancer", fact:"Naturally seeps from soil into homes — requires monitoring"},
  {n:88, sym:"Ra", name:"Radium",        mass:226,     cat:"alkaline",   period:7,group:2,  phase:"Solid", block:"s", config:"[Rn] 7s²",    en:0.90, mp:700,    bp:1737,   density:5.5,    radius:283, discovery:1898, by:"Pierre & Marie Curie",uses:"Cancer treatment, luminous watch dials (historical)",                   hazard:"Extremely radioactive — causes bone cancer",    fact:"Marie Curie discovered it and died from radiation exposure"},
  {n:92, sym:"U",  name:"Uranium",       mass:238.029, cat:"actinide",   period:7,group:null,phase:"Solid",block:"f", config:"[Rn] 5f³6d¹7s²",en:1.38,mp:1135,   bp:4131,   density:19.05,  radius:196, discovery:1789, by:"Martin Heinrich Klaproth",uses:"Nuclear fuel, nuclear weapons, radiation shielding",                   hazard:"Radioactive and chemically toxic",              fact:"A single kilogram of U-235 has energy equivalent to 3 million kg of coal"},
  {n:94, sym:"Pu", name:"Plutonium",     mass:244,     cat:"actinide",   period:7,group:null,phase:"Solid",block:"f", config:"[Rn] 5f⁶7s²", en:1.28, mp:640,    bp:3228,   density:19.84,  radius:186, discovery:1940, by:"Seaborg et al.",     uses:"Nuclear weapons, nuclear reactor fuel, pacemaker batteries",              hazard:"Extremely radioactive and toxic",               fact:"Named after Pluto (then a planet); created artificially"},
];

const CAT = {
  "alkali":     {label:"Alkali Metal",     color:"#f97316"},
  "alkaline":   {label:"Alkaline Earth",   color:"#84cc16"},
  "transition": {label:"Transition Metal", color:"#38bdf8"},
  "post-trans": {label:"Post-Transition",  color:"#94a3b8"},
  "metalloid":  {label:"Metalloid",        color:"#34d399"},
  "nonmetal":   {label:"Nonmetal",         color:"#22d3ee"},
  "halogen":    {label:"Halogen",          color:"#facc15"},
  "noble":      {label:"Noble Gas",        color:"#a78bfa"},
  "lanthanide": {label:"Lanthanide",       color:"#f472b6"},
  "actinide":   {label:"Actinide",         color:"#86efac"},
};

/* Full 18×10 periodic table grid — 0 = empty */
const PT_GRID = [
  [1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2 ],
  [3,  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  5,  6,  7,  8,  9,  10],
  [11, 12, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
  [37, 38, 39, 40, 0,  0,  0,  0,  47, 0,  0,  50, 0,  0,  53, 0,  0,  54],
  [56, 0,  0,  74, 0,  0,  0,  0,  78, 79, 80, 0,  0,  82, 0,  0,  86, 0 ],
  [88, 0,  0,  92, 94, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
];

const EL_MAP = Object.fromEntries(ELEMENTS.map(e => [e.n, e]));
const getEl = n => EL_MAP[n];

/* ═══════════════════════════════════════════════════════════════
   ATOM CANVAS  (real multi-shell rotating electrons)
═══════════════════════════════════════════════════════════════ */
function AtomCanvas({ element, size = 220 }) {
  const canvasRef = useRef();
  const raf = useRef();
  const t = useRef(0);

  const shells = useMemo(() => {
    const n = element?.n || 1;
    if (n <= 2)  return [Math.min(n, 2)];
    if (n <= 10) return [2, Math.min(n - 2, 8)];
    if (n <= 18) return [2, 8, Math.min(n - 10, 8)];
    if (n <= 36) return [2, 8, 18, Math.min(n - 28, 8)];
    if (n <= 54) return [2, 8, 18, 18, Math.min(n - 46, 8)];
    return [2, 8, 18, 32, 18, Math.min(n - 78, 8)];
  }, [element?.n]);

  const col = CAT[element?.cat]?.color || "#22d3ee";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const cx = size / 2, cy = size / 2;

    const draw = () => {
      t.current += 0.012;
      ctx.clearRect(0, 0, size, size);

      // Nucleus ambient glow
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      gr.addColorStop(0, col + "cc");
      gr.addColorStop(0.5, col + "44");
      gr.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = gr; ctx.fill();

      // Nucleus core
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();

      // Symbol
      ctx.font = `bold ${element?.sym?.length > 2 ? 9 : 11}px monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#000"; ctx.fillText(element?.sym || "?", cx, cy);

      // Shells
      const maxR = (size / 2) - 18;
      shells.forEach((count, i) => {
        const R = 32 + (i / (shells.length - 1 || 1)) * (maxR - 32);
        const finalR = shells.length === 1 ? 45 : R;

        // orbit ring
        ctx.beginPath(); ctx.arc(cx, cy, finalR, 0, Math.PI * 2);
        ctx.strokeStyle = col + "25"; ctx.lineWidth = 1; ctx.stroke();

        for (let e = 0; e < count; e++) {
          const angle = (2 * Math.PI * e / count) + t.current / (i + 1);
          const ex = cx + finalR * Math.cos(angle);
          const ey = cy + finalR * Math.sin(angle);
          // electron glow
          const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 7);
          eg.addColorStop(0, "#fff");
          eg.addColorStop(0.4, col);
          eg.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI * 2);
          ctx.fillStyle = eg; ctx.fill();
        }
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [element?.n, size]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

/* ═══════════════════════════════════════════════════════════════
   ELEMENT DETAIL PANEL
═══════════════════════════════════════════════════════════════ */
function ElementPanel({ el, onClose }) {
  if (!el) return null;
  const col = CAT[el.cat]?.color || "#22d3ee";
  const props = [
    ["Atomic Number", el.n],
    ["Atomic Mass", el.mass + " u"],
    ["Period / Group", `${el.period} / ${el.group || "—"}`],
    ["Block", el.block + "-block"],
    ["Phase @ STP", el.phase],
    ["Melting Point", el.mp !== null ? el.mp + " °C" : "—"],
    ["Boiling Point", el.bp !== null ? el.bp + " °C" : "—"],
    ["Density", el.density + (el.phase === "Gas" ? " g/L" : " g/cm³")],
    ["Electronegativity", el.en || "—"],
    ["Atomic Radius", el.radius + " pm"],
    ["Discovery", el.discovery || "Ancient"],
    ["Discovered by", el.by],
  ];

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:500,
      background:"rgba(0,0,0,0.75)",backdropFilter:"blur(12px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%",maxWidth:600,
        background:"#0d0d1a",
        border:`1px solid ${col}40`,
        borderRadius:20,overflow:"hidden",
        boxShadow:`0 0 80px ${col}20`
      }}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg,${col}18,${col}08)`,
          borderBottom:`1px solid ${col}20`,
          padding:"28px 32px",
          display:"flex",alignItems:"center",gap:24
        }}>
          <AtomCanvas element={el} size={140} />
          <div style={{flex:1}}>
            <div style={{
              fontSize:72,fontWeight:900,lineHeight:1,
              color:col,textShadow:`0 0 40px ${col}80`,letterSpacing:-2
            }}>{el.sym}</div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginTop:4}}>{el.name}</div>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:6,
              background:col+"20",border:`1px solid ${col}40`,
              borderRadius:100,padding:"4px 14px",marginTop:8
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",background:col}} />
              <span style={{fontSize:12,color:col,fontWeight:600}}>{CAT[el.cat]?.label}</span>
            </div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:12,marginTop:8}}>
              Config: <span style={{color:col,fontFamily:"monospace"}}>{el.config}</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",
            background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",
            cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
            alignSelf:"flex-start",flexShrink:0
          }}>✕</button>
        </div>

        {/* Properties grid */}
        <div style={{padding:"20px 32px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {props.map(([k,v]) => (
              <div key={k} style={{
                background:"rgba(255,255,255,0.03)",borderRadius:10,
                padding:"10px 14px",border:"1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{String(v)}</div>
              </div>
            ))}
          </div>

          {/* Uses, Hazards, Fact */}
          {[
            {icon:"⚗️",label:"Common Uses",text:el.uses,c:"#22d3ee"},
            {icon:"⚠️",label:"Hazards",text:el.hazard,c:"#f97316"},
            {icon:"✨",label:"Fascinating Fact",text:el.fact,c:"#a78bfa"},
          ].map(({icon,label,text,c}) => (
            <div key={label} style={{
              marginBottom:10,padding:"12px 16px",borderRadius:12,
              background:`${c}08`,border:`1px solid ${c}25`
            }}>
              <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:4}}>{icon} {label}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.6}}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PERIODIC TABLE
═══════════════════════════════════════════════════════════════ */
function PeriodicTable({ onSelect }) {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    return ELEMENTS.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.sym.toLowerCase() === q ||
      String(e.n) === q ||
      e.cat.includes(q)
    );
  }, [search]);

  const CELL = 52;

  return (
    <div>
      {/* Search */}
      <div style={{ position:"relative", marginBottom:24 }}>
        <span style={{
          position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",
          color:"rgba(255,255,255,0.3)",fontSize:16,pointerEvents:"none"
        }}>⌕</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search element, symbol, or number…"
          style={{
            width:"100%",boxSizing:"border-box",
            padding:"13px 16px 13px 44px",
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:12,color:"#e2e8f0",fontSize:14,
            fontFamily:"inherit",outline:"none",
            transition:"border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = "rgba(34,211,238,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
            background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:16
          }}>✕</button>
        )}
      </div>

      {filtered ? (
        <div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:12 }}>
            {filtered.length} element{filtered.length !== 1 ? "s" : ""} found
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {filtered.map(el => {
              const c = CAT[el.cat]?.color || "#22d3ee";
              return (
                <div key={el.n} onClick={() => onSelect(el)}
                  style={{
                    width:CELL,height:64,padding:"6px 4px",textAlign:"center",cursor:"pointer",
                    background:`${c}15`,border:`1px solid ${c}40`,borderRadius:10,
                    transition:"all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow=`0 0 18px ${c}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                >
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>{el.n}</div>
                  <div style={{fontSize:18,fontWeight:900,color:c,lineHeight:1.2}}>{el.sym}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.45)",marginTop:1,lineHeight:1.2}}>{el.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div style={{overflowX:"auto",paddingBottom:8}}>
            <div style={{minWidth:PT_GRID[0].length * (CELL + 3)}}>
              {/* Group labels */}
              <div style={{display:"flex",gap:3,marginBottom:4,paddingLeft:0}}>
                {Array.from({length:18},(_,i)=>(
                  <div key={i} style={{width:CELL,textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.2)",flexShrink:0}}>
                    {i+1}
                  </div>
                ))}
              </div>

              {PT_GRID.map((row, ri) => (
                <div key={ri} style={{display:"flex",gap:3,marginBottom:3}}>
                  {row.map((n, ci) => {
                    const el = n ? getEl(n) : null;
                    const c = el ? (CAT[el.cat]?.color || "#22d3ee") : null;
                    const isHov = hovered === n;
                    return (
                      <div key={ci} onClick={() => el && onSelect(el)}
                        onMouseEnter={() => el && setHovered(n)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width:CELL,height:CELL,flexShrink:0,
                          display:"flex",flexDirection:"column",
                          alignItems:"center",justifyContent:"center",
                          borderRadius:7,
                          cursor: el ? "pointer" : "default",
                          background: el
                            ? isHov ? `${c}35` : `${c}12`
                            : "transparent",
                          border: el
                            ? `1px solid ${isHov ? c : c+"30"}`
                            : "none",
                          transform: isHov ? "scale(1.12) translateY(-2px)" : "scale(1)",
                          boxShadow: isHov ? `0 4px 20px ${c}40` : "none",
                          transition:"all 0.15s ease",
                          position:"relative",zIndex: isHov?10:1
                        }}
                      >
                        {el && <>
                          <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",lineHeight:1}}>{el.n}</div>
                          <div style={{fontSize:15,fontWeight:900,color:c,lineHeight:1.2,letterSpacing:-0.5}}>{el.sym}</div>
                          <div style={{fontSize:7,color:"rgba(255,255,255,0.4)",lineHeight:1.2,textAlign:"center",padding:"0 2px"}}>{el.name}</div>
                        </>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:20}}>
            {Object.entries(CAT).map(([k,v]) => (
              <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:10,height:10,borderRadius:3,background:v.color,flexShrink:0}} />
                <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{v.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hovered element quick tooltip */}
      {hovered && !search && (() => {
        const el = getEl(hovered);
        const c = CAT[el.cat]?.color || "#22d3ee";
        return (
          <div style={{
            marginTop:16,padding:"12px 20px",
            background:`${c}10`,border:`1px solid ${c}30`,borderRadius:12,
            display:"flex",alignItems:"center",gap:16,transition:"all 0.2s"
          }}>
            <span style={{fontSize:28,fontWeight:900,color:c,letterSpacing:-1}}>{el.sym}</span>
            <div>
              <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{el.name}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                #{el.n} · {el.mass} u · {el.phase} · {CAT[el.cat]?.label}
              </div>
            </div>
            <div style={{marginLeft:"auto",fontSize:12,color:"rgba(255,255,255,0.3)"}}>Click to explore →</div>
          </div>
        );
      })()}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOLS
═══════════════════════════════════════════════════════════════ */

function MolarMassCalc() {
  const [formula, setFormula] = useState("H2O");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  const MASSES = {H:1.008,He:4.003,Li:6.941,Be:9.012,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998,Ne:20.18,Na:22.99,Mg:24.305,Al:26.982,Si:28.085,P:30.974,S:32.06,Cl:35.45,Ar:39.948,K:39.098,Ca:40.078,Fe:55.845,Cu:63.546,Zn:65.38,Ag:107.868,Au:196.967,Pb:207.2,Hg:200.592,I:126.904,Br:79.904,Mn:54.938,Cr:51.996,Ni:58.693,Co:58.933,Ti:47.867,Pt:195.084,U:238.029};

  const parse = (f) => {
    const tokens = [];
    let i = 0;
    while (i < f.length) {
      if (f[i] === '(') {
        let j = i+1, depth = 1;
        while (j < f.length && depth > 0) { if(f[j]==='(')depth++; if(f[j]===')')depth--; j++; }
        const inner = parse(f.slice(i+1,j-1));
        i = j;
        let num = "";
        while (i < f.length && /\d/.test(f[i])) { num += f[i]; i++; }
        const mult = num ? parseInt(num) : 1;
        inner.forEach(([sym,cnt]) => tokens.push([sym, cnt*mult]));
      } else if (/[A-Z]/.test(f[i])) {
        let sym = f[i]; i++;
        while (i < f.length && /[a-z]/.test(f[i])) { sym += f[i]; i++; }
        let num = "";
        while (i < f.length && /\d/.test(f[i])) { num += f[i]; i++; }
        tokens.push([sym, num ? parseInt(num) : 1]);
      } else i++;
    }
    return tokens;
  };

  const calc = () => {
    try {
      const tokens = parse(formula.trim());
      const breakdown = {};
      let total = 0;
      tokens.forEach(([sym,cnt]) => {
        if (!MASSES[sym]) throw new Error(`Unknown: ${sym}`);
        breakdown[sym] = (breakdown[sym]||0) + cnt;
        total += MASSES[sym] * cnt;
      });
      setResult({breakdown, total: total.toFixed(4)});
      setErr(null);
    } catch(e) { setErr(e.message); setResult(null); }
  };

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <input value={formula} onChange={e=>setFormula(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&calc()}
          placeholder="e.g. H2O, NaCl, C6H12O6"
          style={{flex:1,padding:"11px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,color:"#e2e8f0",fontSize:14,fontFamily:"monospace",outline:"none"}}/>
        <button onClick={calc} style={{padding:"11px 20px",background:"#22d3ee",border:"none",borderRadius:10,color:"#000",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"inherit",flexShrink:0}}>Calculate</button>
      </div>
      {err && <div style={{color:"#f97316",fontSize:13,marginBottom:12}}>⚠ {err}</div>}
      {result && (
        <div style={{background:"rgba(34,211,238,0.06)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:12,padding:20}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            {Object.entries(result.breakdown).map(([sym,cnt])=> {
              const m = MASSES[sym];
              return (
                <div key={sym} style={{background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"8px 14px",fontSize:13}}>
                  <span style={{color:"#22d3ee",fontWeight:700}}>{sym}</span>
                  <span style={{color:"rgba(255,255,255,0.5)"}}> ×{cnt} = </span>
                  <span style={{color:"#e2e8f0",fontWeight:600}}>{(m*cnt).toFixed(3)} g/mol</span>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:24,fontWeight:900,color:"#22d3ee"}}>
            M = {result.total} <span style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>g/mol</span>
          </div>
        </div>
      )}
    </div>
  );
}

const SOLUBILITY = {
  "NO₃⁻":"All nitrates soluble",
  "CH₃COO⁻":"Most acetates soluble (except Ag, Hg)",
  "Cl⁻":"Most chlorides soluble (except Ag, Pb, Hg₂)",
  "SO₄²⁻":"Most sulfates soluble (except Ba, Pb, Ca, Sr, Hg)",
  "OH⁻":"Insoluble except group 1, Ba, Sr, Ca (slightly)",
  "CO₃²⁻":"Insoluble except group 1 and NH₄⁺",
  "PO₄³⁻":"Insoluble except group 1 and NH₄⁺",
  "S²⁻":"Insoluble except group 1, 2 and NH₄⁺",
};

function SolubilityTable() {
  const ions = ["NO₃⁻","Cl⁻","SO₄²⁻","OH⁻","CO₃²⁻","PO₄³⁻","S²⁻","CH₃COO⁻"];
  const cations = ["Na⁺","K⁺","NH₄⁺","Ca²⁺","Mg²⁺","Ba²⁺","Fe²⁺","Fe³⁺","Cu²⁺","Ag⁺","Pb²⁺","Zn²⁺","Al³⁺"];
  const table = {
    "Na⁺":  {NO3:1,Cl:1,SO4:1,OH:1,CO3:1,PO4:1,S:1,Ac:1},
    "K⁺":   {NO3:1,Cl:1,SO4:1,OH:1,CO3:1,PO4:1,S:1,Ac:1},
    "NH₄⁺": {NO3:1,Cl:1,SO4:1,OH:1,CO3:1,PO4:1,S:1,Ac:1},
    "Ca²⁺": {NO3:1,Cl:1,SO4:0,OH:2,CO3:0,PO4:0,S:1,Ac:1},
    "Mg²⁺": {NO3:1,Cl:1,SO4:1,OH:0,CO3:0,PO4:0,S:1,Ac:1},
    "Ba²⁺": {NO3:1,Cl:1,SO4:0,OH:1,CO3:0,PO4:0,S:1,Ac:1},
    "Fe²⁺": {NO3:1,Cl:1,SO4:1,OH:0,CO3:0,PO4:0,S:0,Ac:1},
    "Fe³⁺": {NO3:1,Cl:1,SO4:1,OH:0,CO3:0,PO4:0,S:0,Ac:1},
    "Cu²⁺": {NO3:1,Cl:1,SO4:1,OH:0,CO3:0,PO4:0,S:0,Ac:1},
    "Ag⁺":  {NO3:1,Cl:0,SO4:2,OH:0,CO3:0,PO4:0,S:0,Ac:0},
    "Pb²⁺": {NO3:1,Cl:0,SO4:0,OH:0,CO3:0,PO4:0,S:0,Ac:1},
    "Zn²⁺": {NO3:1,Cl:1,SO4:1,OH:0,CO3:0,PO4:0,S:0,Ac:1},
    "Al³⁺": {NO3:1,Cl:1,SO4:1,OH:0,CO3:0,PO4:0,S:0,Ac:1},
  };
  const keys = ["NO3","Cl","SO4","OH","CO3","PO4","S","Ac"];
  const labels = ["NO₃⁻","Cl⁻","SO₄²⁻","OH⁻","CO₃²⁻","PO₄³⁻","S²⁻","CH₃COO⁻"];
  return (
    <div>
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",fontSize:11,width:"100%",minWidth:480}}>
          <thead>
            <tr>
              <th style={{padding:"8px 12px",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",borderRadius:"8px 0 0 0",fontSize:10,textAlign:"left"}}>Cation ↓ / Anion →</th>
              {labels.map(l=><th key={l} style={{padding:"8px 8px",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",fontSize:10,fontFamily:"monospace"}}>{l}</th>)}
            </tr>
          </thead>
          <tbody>
            {cations.map((cat,ri)=>(
              <tr key={cat} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.02)"}}>
                <td style={{padding:"7px 12px",color:"#e2e8f0",fontWeight:700,fontFamily:"monospace",fontSize:12}}>{cat}</td>
                {keys.map(k=>{
                  const v = table[cat]?.[k];
                  return <td key={k} style={{padding:"7px 8px",textAlign:"center"}}>
                    {v===1?<span style={{color:"#4ade80",fontSize:14}}>✓</span>:
                     v===0?<span style={{color:"#f87171",fontSize:14}}>✗</span>:
                     <span style={{color:"#facc15",fontSize:10}}>sl</span>}
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:16,marginTop:12}}>
        {[["✓","#4ade80","Soluble"],["✗","#f87171","Insoluble"],["sl","#facc15","Slightly Soluble"]].map(([s,c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:c,fontSize:13,fontWeight:700}}>{s}</span>
            <span style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const WORKSHEET_REACTIONS = {
  synthesis: [
    {r:"2H₂ + O₂", p:"2H₂O", type:"Synthesis"},
    {r:"Na + Cl₂", p:"2NaCl", type:"Synthesis (unbalanced)"},
    {r:"2Mg + O₂", p:"2MgO", type:"Synthesis"},
    {r:"N₂ + 3H₂", p:"2NH₃", type:"Synthesis"},
    {r:"SO₃ + H₂O", p:"H₂SO₄", type:"Synthesis"},
    {r:"CaO + H₂O", p:"Ca(OH)₂", type:"Synthesis"},
    {r:"2Fe + 3Cl₂", p:"2FeCl₃", type:"Synthesis"},
    {r:"CO₂ + H₂O", p:"H₂CO₃", type:"Synthesis"},
  ],
  decomposition: [
    {r:"2H₂O₂", p:"2H₂O + O₂", type:"Decomposition"},
    {r:"2H₂O", p:"2H₂ + O₂", type:"Decomposition"},
    {r:"CaCO₃", p:"CaO + CO₂", type:"Decomposition"},
    {r:"2KClO₃", p:"2KCl + 3O₂", type:"Decomposition"},
    {r:"2NaN₃", p:"2Na + 3N₂", type:"Decomposition"},
    {r:"2HgO", p:"2Hg + O₂", type:"Decomposition"},
  ],
  combustion: [
    {r:"CH₄ + 2O₂", p:"CO₂ + 2H₂O", type:"Combustion"},
    {r:"2C₂H₂ + 5O₂", p:"4CO₂ + 2H₂O", type:"Combustion"},
    {r:"C₃H₈ + 5O₂", p:"3CO₂ + 4H₂O", type:"Combustion"},
    {r:"2C₈H₁₈ + 25O₂", p:"16CO₂ + 18H₂O", type:"Combustion"},
    {r:"2C₂H₆ + 7O₂", p:"4CO₂ + 6H₂O", type:"Combustion"},
  ],
};

function WorksheetGen() {
  const [type, setType] = useState("synthesis");
  const [qty, setQty] = useState(5);
  const [ws, setWs] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const generate = () => {
    const pool = WORKSHEET_REACTIONS[type] || WORKSHEET_REACTIONS.synthesis;
    const shuffled = [...pool].sort(() => Math.random()-0.5);
    setWs(shuffled.slice(0, Math.min(qty, pool.length)));
    setShowAnswers(false);
  };

  const print = () => {
    const content = ws.map((q,i)=>
      `${i+1}. Balance: ${q.r} → _____\n   ${showAnswers?`Answer: ${q.r} → ${q.p}`:""}`
    ).join("\n\n");
    const win = window.open("","_blank");
    win.document.write(`<html><body><h2>Chemistry Worksheet — ${type.charAt(0).toUpperCase()+type.slice(1)}</h2><pre style="font-size:15px;line-height:2">${content}</pre></body></html>`);
    win.print();
  };

  return (
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Reaction Type</div>
          <div style={{display:"flex",gap:8}}>
            {["synthesis","decomposition","combustion"].map(t=>(
              <button key={t} onClick={()=>setType(t)} style={{
                padding:"8px 14px",borderRadius:8,border:`1px solid ${type===t?"#22d3ee":"rgba(255,255,255,0.12)"}`,
                background:type===t?"rgba(34,211,238,0.15)":"rgba(255,255,255,0.04)",
                color:type===t?"#22d3ee":"rgba(255,255,255,0.5)",
                cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:type===t?700:400,
                textTransform:"capitalize",transition:"all 0.15s"
              }}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Questions</div>
          <div style={{display:"flex",gap:8}}>
            {[3,5,8,10].map(q=>(
              <button key={q} onClick={()=>setQty(q)} style={{
                width:40,padding:"8px 0",borderRadius:8,border:`1px solid ${qty===q?"#22d3ee":"rgba(255,255,255,0.12)"}`,
                background:qty===q?"rgba(34,211,238,0.15)":"rgba(255,255,255,0.04)",
                color:qty===q?"#22d3ee":"rgba(255,255,255,0.5)",
                cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700,transition:"all 0.15s"
              }}>{q}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:24}}>
        <button onClick={generate} style={{padding:"11px 24px",background:"#22d3ee",border:"none",borderRadius:10,color:"#000",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>Generate Worksheet</button>
        {ws && <button onClick={()=>setShowAnswers(s=>!s)} style={{padding:"11px 20px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,color:"#e2e8f0",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>{showAnswers?"Hide":"Show"} Answers</button>}
        {ws && <button onClick={print} style={{padding:"11px 20px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,color:"#e2e8f0",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>🖨 Print</button>}
      </div>
      {ws && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {ws.map((q,i)=>(
            <div key={i} style={{
              padding:"16px 20px",background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,
              display:"flex",alignItems:"center",gap:16
            }}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(34,211,238,0.15)",
                color:"#22d3ee",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <span style={{fontFamily:"monospace",color:"#e2e8f0",fontSize:14}}>
                  Balance: <strong style={{color:"#22d3ee"}}>{q.r}</strong> → {showAnswers?<strong style={{color:"#4ade80"}}>{q.p}</strong>:<span style={{color:"rgba(255,255,255,0.2)",borderBottom:"1px solid rgba(255,255,255,0.2)",display:"inline-block",minWidth:80}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                </span>
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",flexShrink:0}}>{q.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI CHAT
═══════════════════════════════════════════════════════════════ */
function AIChat() {
  const [msgs, setMsgs] = useState([{
    role:"ai",
    text:"مرحباً! أنا مساعد الكيمياء الذكي لـ As6yer El Kymya 🧪\nاسألني عن أي شيء في الكيمياء — معادلات، عناصر، مفاهيم، مسائل.\n\nHello! Ask me anything about chemistry in Arabic or English."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    const newMsgs = [...msgs, {role:"user", text:q}];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are ChemBot, the AI chemistry tutor for "As6yer El Kymya" (أسطى الكيمياء), a premium Arabic/Egyptian chemistry education platform. 
          You are expert in high school and university chemistry. Respond in the same language the user uses (Arabic or English).
          Be engaging, precise, and educational. Use chemical notation, formulas, and equations where helpful.
          For Arabic responses, use proper chemistry terminology in Arabic. Keep responses concise but complete.`,
          messages: newMsgs.map(m => ({role: m.role==="ai"?"assistant":"user", content: m.text}))
        })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("") || "خطأ في الاتصال. حاول مجدداً.";
      setMsgs(m => [...m, {role:"ai", text}]);
    } catch {
      setMsgs(m => [...m, {role:"ai", text:"❌ Connection error. Please try again."}]);
    }
    setLoading(false);
  };

  const suggestions = ["ما هو الجدول الدوري؟","How does electronegativity work?","ما الفرق بين التفاعل الطارد والماص للحرارة؟","Balance: Fe + O2 → Fe2O3"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:520}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",gap:10,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="ai" && (
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#7c3aed)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,alignSelf:"flex-end"}}>🧪</div>
            )}
            <div style={{
              maxWidth:"78%",padding:"12px 16px",
              borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role==="user"
                ? "linear-gradient(135deg,#0ea5e9,#7c3aed)"
                : "rgba(255,255,255,0.05)",
              border: m.role==="ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
              color:"#e2e8f0",fontSize:13.5,lineHeight:1.65,whiteSpace:"pre-wrap",
              direction: /[\u0600-\u06FF]/.test(m.text.slice(0,20)) ? "rtl" : "ltr"
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#7c3aed)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🧪</div>
            <div style={{display:"flex",gap:5,padding:"14px 18px",background:"rgba(255,255,255,0.05)",borderRadius:"18px 18px 18px 4px",border:"1px solid rgba(255,255,255,0.08)"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#22d3ee",
                  animation:`dotPulse 1.2s ${i*0.2}s ease-in-out infinite`}} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {msgs.length < 3 && (
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          {suggestions.map(s=>(
            <button key={s} onClick={()=>setInput(s)} style={{
              padding:"6px 12px",background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.2)",
              borderRadius:20,color:"#22d3ee",fontSize:11,cursor:"pointer",fontFamily:"inherit",
              direction:/[\u0600-\u06FF]/.test(s)?'rtl':'ltr'
            }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10}}>
        <input
          value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="اسأل عن الكيمياء... / Ask about chemistry..."
          style={{
            flex:1,padding:"12px 16px",background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,
            color:"#e2e8f0",fontSize:13.5,fontFamily:"inherit",outline:"none",
            direction:"auto",
            transition:"border-color 0.2s"
          }}
          onFocus={e=>e.target.style.borderColor="rgba(34,211,238,0.4)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}
        />
        <button onClick={send} disabled={!input.trim()||loading} style={{
          width:48,height:48,borderRadius:12,background:"#22d3ee",border:"none",
          color:"#000",cursor:"pointer",fontSize:20,flexShrink:0,
          opacity:!input.trim()||loading?0.4:1,transition:"opacity 0.2s"
        }}>↑</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════════════════════════ */
const QUIZ = [
  {q:"What is the chemical formula for sulfuric acid?",opts:["H₂SO₃","H₂SO₄","HSO₄","H₂S"],ans:1},
  {q:"Which element has the highest electronegativity?",opts:["Oxygen","Chlorine","Nitrogen","Fluorine"],ans:3},
  {q:"The pH of a neutral solution at 25°C is:",opts:["0","7","14","3.5"],ans:1},
  {q:"Which type of bond involves electron sharing?",opts:["Ionic","Metallic","Covalent","Hydrogen"],ans:2},
  {q:"What is Avogadro's number (approximately)?",opts:["6.02×10²³","6.02×10²⁰","3.14×10²³","9.11×10³¹"],ans:0},
  {q:"Which gas law states PV = nRT?",opts:["Boyle's Law","Charles's Law","Ideal Gas Law","Dalton's Law"],ans:2},
  {q:"An atom of Carbon-14 has how many neutrons?",opts:["6","8","14","12"],ans:1},
  {q:"Which reaction type is: AB → A + B?",opts:["Synthesis","Decomposition","Combustion","Displacement"],ans:1},
  {q:"Oxidation involves:",opts:["Gaining electrons","Losing protons","Losing electrons","Gaining neutrons"],ans:2},
  {q:"What is the molar mass of NaCl (g/mol)?",opts:["23","35.5","58.5","74"],ans:2},
];

function QuizSection() {
  const [started, setStarted] = useState(false);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const pick = i => {
    if (sel !== null) return;
    setSel(i);
    if (i === QUIZ[qi].ans) setScore(s=>s+1);
  };

  const next = () => {
    if (qi+1 >= QUIZ.length) setDone(true);
    else { setQi(q=>q+1); setSel(null); setShowExp(false); }
  };

  const reset = () => { setQi(0);setSel(null);setScore(0);setDone(false);setStarted(false);setShowExp(false); };

  if (!started) return (
    <div style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{fontSize:48,marginBottom:16}}>🧩</div>
      <h3 style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}}>Chemistry Quiz</h3>
      <p style={{color:"rgba(255,255,255,0.45)",marginBottom:28,lineHeight:1.6}}>
        {QUIZ.length} questions covering key chemistry concepts.<br/>Test your Grade 9–12 knowledge.
      </p>
      <button onClick={()=>setStarted(true)} style={{
        padding:"14px 36px",background:"linear-gradient(135deg,#22d3ee,#7c3aed)",
        border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"
      }}>Start Quiz →</button>
    </div>
  );

  if (done) return (
    <div style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{fontSize:56,marginBottom:12}}>
        {score>=8?"🏆":score>=5?"🥈":"🧪"}
      </div>
      <div style={{fontSize:48,fontWeight:900,color:"#22d3ee",marginBottom:4}}>{score}/{QUIZ.length}</div>
      <div style={{color:"rgba(255,255,255,0.5)",marginBottom:8,fontSize:15}}>
        {score===QUIZ.length?"Perfect! Genius chemist! 🎉":
         score>=7?"Great work! Well done 💪":
         score>=5?"Good effort! Keep studying 📚":"Keep going! Chemistry takes practice 💡"}
      </div>
      <div style={{
        display:"inline-block",margin:"16px 0 28px",padding:"10px 24px",
        background:"rgba(34,211,238,0.08)",borderRadius:100,
        fontSize:14,color:"#22d3ee",border:"1px solid rgba(34,211,238,0.2)"
      }}>{Math.round(score/QUIZ.length*100)}% Score</div>
      <br/>
      <button onClick={reset} style={{padding:"13px 32px",background:"linear-gradient(135deg,#22d3ee,#7c3aed)",border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Try Again</button>
    </div>
  );

  const q = QUIZ[qi];
  return (
    <div>
      {/* Progress */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Q {qi+1} / {QUIZ.length}</span>
        <span style={{fontSize:12,color:"#22d3ee",fontWeight:700}}>Score: {score}</span>
      </div>
      <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:2,marginBottom:24}}>
        <div style={{height:"100%",width:`${(qi/QUIZ.length)*100}%`,background:"linear-gradient(90deg,#22d3ee,#7c3aed)",borderRadius:2,transition:"width 0.4s"}} />
      </div>

      <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0",marginBottom:20,lineHeight:1.5}}>{q.q}</div>

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {q.opts.map((opt,i) => {
          const isRight = i === q.ans;
          const isSel = i === sel;
          let bg = "rgba(255,255,255,0.04)";
          let bc = "rgba(255,255,255,0.1)";
          let tc = "#e2e8f0";
          if (sel !== null) {
            if (isRight) { bg="rgba(74,222,128,0.12)"; bc="#4ade80"; tc="#4ade80"; }
            else if (isSel && !isRight) { bg="rgba(248,113,113,0.12)"; bc="#f87171"; tc="#f87171"; }
          }
          return (
            <button key={i} onClick={()=>pick(i)} style={{
              padding:"13px 18px",background:bg,border:`1px solid ${bc}`,borderRadius:10,
              color:tc,cursor:sel!==null?"default":"pointer",textAlign:"left",
              fontSize:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,transition:"all 0.2s"
            }}>
              <span style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,0.07)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,color:tc}}>
                {["A","B","C","D"][i]}
              </span>
              {opt}
              {sel!==null && isRight && <span style={{marginLeft:"auto"}}>✓</span>}
              {sel!==null && isSel && !isRight && <span style={{marginLeft:"auto"}}>✗</span>}
            </button>
          );
        })}
      </div>

      {sel !== null && (
        <button onClick={next} style={{
          width:"100%",padding:"12px 0",background:"linear-gradient(135deg,#22d3ee,#7c3aed)",
          border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"
        }}>{qi+1>=QUIZ.length?"See Results →":"Next Question →"}</button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND PARTICLES
═══════════════════════════════════════════════════════════════ */
function Particles() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let W,H,pts,raf;
    const init = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      pts = Array.from({length:80},()=>({
        x:Math.random()*W,y:Math.random()*H,
        vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
        r:Math.random()*1.2+.4,
        h:Math.random()<.5?195:270
      }));
    };
    init();
    window.addEventListener("resize",init);
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;
        if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.h},100%,70%,0.5)`;
        ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(34,211,238,${(1-d/110)*.1})`;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",init);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:0.5}} />;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
const TABS = [
  {id:"table",   label:"Periodic Table", icon:"⬡"},
  {id:"atom",    label:"Atom Viewer",    icon:"⚛"},
  {id:"tools",   label:"Tools",          icon:"⚗"},
  {id:"worksheet",label:"Worksheet",     icon:"📋"},
  {id:"quiz",    label:"Quiz",           icon:"🧩"},
  {id:"ai",      label:"AI Tutor",       icon:"🤖"},
];

export default function App() {
  const [tab, setTab] = useState("table");
  const [selectedEl, setSelectedEl] = useState(null);
  const [atomEl, setAtomEl] = useState(ELEMENTS.find(e=>e.n===6));
  const [toolTab, setToolTab] = useState("molar");
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef();

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 20);
    el.addEventListener("scroll",fn);
    return () => el.removeEventListener("scroll",fn);
  },[]);

  const TOOL_TABS = [
    {id:"molar",label:"Molar Mass",icon:"⚗"},
    {id:"solubility",label:"Solubility",icon:"💧"},
  ];

  return (
    <div style={{
      display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",
      fontFamily:'"SF Pro Text",-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
      background:"#07070f",color:"#e2e8f0"
    }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(34,211,238,0.25);border-radius:3px}
        input,button,textarea{font-family:inherit}
        @keyframes dotPulse{0%,100%{opacity:.3;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(34,211,238,.3)}50%{box-shadow:0 0 40px rgba(34,211,238,.6)}}
      `}</style>

      <Particles />

      {/* ── TOP BAR ── */}
      <header style={{
        position:"relative",zIndex:50,
        background:"rgba(7,7,15,0.88)",
        borderBottom:"1px solid rgba(255,255,255,0.07)",
        backdropFilter:"blur(20px)",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 24px",height:60,flexShrink:0
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{
            width:34,height:34,borderRadius:10,
            background:"linear-gradient(135deg,#22d3ee,#7c3aed)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:17,boxShadow:"0 0 20px rgba(34,211,238,0.4)"
          }}>⚗</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>
              As6yer El Kymya
              <span style={{color:"#22d3ee"}}> ⚗</span>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:1,textTransform:"uppercase"}}>أسطى الكيمياء</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{display:"flex",gap:2}}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"7px 14px",borderRadius:9,border:"none",
              background:tab===t.id?"rgba(34,211,238,0.12)":"transparent",
              color:tab===t.id?"#22d3ee":"rgba(255,255,255,0.45)",
              cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,
              display:"flex",alignItems:"center",gap:6,transition:"all 0.15s",
              outline:"none"
            }}>
              <span style={{fontSize:14}}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div style={{
          padding:"6px 14px",borderRadius:100,
          background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.2)",
          fontSize:11,color:"#22d3ee",fontWeight:600,letterSpacing:0.5
        }}>v1.0 · 2025</div>
      </header>

      {/* ── CONTENT ── */}
      <main ref={contentRef} style={{flex:1,overflowY:"auto",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1320,margin:"0 auto",padding:"32px 24px 80px",animation:"slideUp 0.3s ease both"}}>

          {/* ══ PERIODIC TABLE ══ */}
          {tab==="table" && (
            <div>
              <SectionHeader title="Periodic Table of Elements" sub="118 elements · Click any element to explore" />
              <Card>
                <PeriodicTable onSelect={el => { setSelectedEl(el); setAtomEl(el); }} />
              </Card>
            </div>
          )}

          {/* ══ ATOM VIEWER ══ */}
          {tab==="atom" && (
            <div>
              <SectionHeader title="Atom Visualizer" sub="Live electron shell animation" />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"start"}}>
                <Card style={{textAlign:"center",padding:40}}>
                  <AtomCanvas element={atomEl} size={260} />
                  <div style={{marginTop:20}}>
                    <div style={{fontSize:52,fontWeight:900,color:CAT[atomEl.cat]?.color||"#22d3ee",lineHeight:1,letterSpacing:-2}}>{atomEl.sym}</div>
                    <div style={{fontSize:18,fontWeight:700,color:"#fff",marginTop:4}}>{atomEl.name}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:4,fontFamily:"monospace"}}>{atomEl.config}</div>
                    <div style={{
                      display:"inline-flex",alignItems:"center",gap:6,marginTop:12,
                      padding:"5px 14px",borderRadius:100,
                      background:`${CAT[atomEl.cat]?.color||"#22d3ee"}15`,
                      border:`1px solid ${CAT[atomEl.cat]?.color||"#22d3ee"}30`
                    }}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:CAT[atomEl.cat]?.color||"#22d3ee"}} />
                      <span style={{fontSize:11,color:CAT[atomEl.cat]?.color||"#22d3ee",fontWeight:600}}>{CAT[atomEl.cat]?.label}</span>
                    </div>
                  </div>
                </Card>
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <Card>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Select Element</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {ELEMENTS.map(el => {
                        const c = CAT[el.cat]?.color||"#22d3ee";
                        const isA = atomEl.n===el.n;
                        return (
                          <button key={el.n} onClick={()=>setAtomEl(el)} style={{
                            padding:"5px 10px",borderRadius:7,border:`1px solid ${isA?c:c+"30"}`,
                            background:isA?`${c}20`:`${c}08`,
                            color:isA?c:`${c}90`,
                            cursor:"pointer",fontSize:12,fontWeight:isA?800:400,transition:"all 0.15s"
                          }}>{el.sym}</button>
                        );
                      })}
                    </div>
                  </Card>
                  <Card>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Properties</div>
                    {[
                      ["Atomic Number", atomEl.n],
                      ["Atomic Mass", atomEl.mass+" u"],
                      ["Phase @ STP", atomEl.phase],
                      ["Melting Point", atomEl.mp+"°C"],
                      ["Boiling Point", atomEl.bp+"°C"],
                      ["Electronegativity", atomEl.en||"—"],
                      ["Atomic Radius", atomEl.radius+" pm"],
                      ["Block", atomEl.block+"-block"],
                    ].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                        <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{k}</span>
                        <span style={{fontSize:13,color:"#e2e8f0",fontWeight:600,fontFamily:"monospace"}}>{String(v)}</span>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ══ TOOLS ══ */}
          {tab==="tools" && (
            <div>
              <SectionHeader title="Chemistry Tools" sub="Calculators & Reference Tables" />
              <div style={{display:"flex",gap:8,marginBottom:20}}>
                {TOOL_TABS.map(t=>(
                  <button key={t.id} onClick={()=>setToolTab(t.id)} style={{
                    padding:"9px 18px",borderRadius:10,border:`1px solid ${toolTab===t.id?"rgba(34,211,238,0.4)":"rgba(255,255,255,0.1)"}`,
                    background:toolTab===t.id?"rgba(34,211,238,0.1)":"rgba(255,255,255,0.04)",
                    color:toolTab===t.id?"#22d3ee":"rgba(255,255,255,0.5)",
                    cursor:"pointer",fontSize:13,fontWeight:toolTab===t.id?700:400,
                    display:"flex",alignItems:"center",gap:7,transition:"all 0.15s"
                  }}>
                    <span>{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
              <Card>
                {toolTab==="molar" && <>
                  <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Molar Mass Calculator</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Enter a chemical formula to calculate molar mass</div>
                  <MolarMassCalc />
                </>}
                {toolTab==="solubility" && <>
                  <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Solubility Table</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Solubility rules for common ionic compounds</div>
                  <SolubilityTable />
                </>}
              </Card>
            </div>
          )}

          {/* ══ WORKSHEET ══ */}
          {tab==="worksheet" && (
            <div>
              <SectionHeader title="Worksheet Generator" sub="Generate and print custom chemistry practice sheets" />
              <Card><WorksheetGen /></Card>
            </div>
          )}

          {/* ══ QUIZ ══ */}
          {tab==="quiz" && (
            <div>
              <SectionHeader title="Chemistry Quiz" sub="Grade 9–12 · 10 Questions" />
              <Card style={{maxWidth:640,margin:"0 auto"}}><QuizSection /></Card>
            </div>
          )}

          {/* ══ AI ══ */}
          {tab==="ai" && (
            <div>
              <SectionHeader title="AI Chemistry Tutor" sub="Powered by Claude · Arabic & English" />
              <Card style={{maxWidth:760,margin:"0 auto"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#22d3ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧪</div>
                  <div>
                    <div style={{fontWeight:700,color:"#fff",fontSize:15}}>ChemBot AI</div>
                    <div style={{fontSize:11,color:"#4ade80",display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",animation:"glow 2s infinite"}} />
                      Online · Bilingual (AR/EN)
                    </div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,0.25)"}}>claude-sonnet-4</div>
                </div>
                <AIChat />
              </Card>
            </div>
          )}

        </div>
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <div style={{
        display:"none",
        // shown via media query (we include a style tag below)
      }} id="mobile-tabs">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:"10px 0 6px",border:"none",background:"transparent",
            color:tab===t.id?"#22d3ee":"rgba(255,255,255,0.35)",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",gap:3
          }}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:9,fontFamily:"inherit",fontWeight:tab===t.id?700:400}}>{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media(max-width:768px){
          #mobile-tabs{display:flex!important;position:fixed;bottom:0;left:0;right:0;z-index:50;
            background:rgba(7,7,15,0.95);border-top:1px solid rgba(255,255,255,0.08);
            backdrop-filter:blur(20px);padding-bottom:env(safe-area-inset-bottom)}
          nav{display:none!important}
        }
      `}</style>

      {/* Element panel */}
      <ElementPanel el={selectedEl} onClose={()=>setSelectedEl(null)} />
    </div>
  );
}

function Card({children, style={}}) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.025)",
      border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:18,
      padding:28,
      backdropFilter:"blur(8px)",
      ...style
    }}>{children}</div>
  );
}

function SectionHeader({title, sub}) {
  return (
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:-0.5,marginBottom:4}}>{title}</h1>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>{sub}</p>
    </div>
  );
}
