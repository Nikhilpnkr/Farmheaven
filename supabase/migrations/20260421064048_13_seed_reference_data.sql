-- Species (Indian livestock focus)
insert into public.species (code, label, telugu_label, hindi_label, gestation_days, typical_lifespan_years, tracks_individually) values
  ('cattle','Cattle (cow)','ఆవు','गाय', 283, 18, true),
  ('buffalo','Buffalo','గేదె','भैंस', 310, 20, true),
  ('goat','Goat','మేక','बकरी', 150, 12, true),
  ('sheep','Sheep','గొర్రె','भेड़', 150, 12, true),
  ('poultry','Poultry (chicken)','కోడి','मुर्गी', 21, 8, false),
  ('bee','Honey bee','తేనెటీగ','मधुमक्खी', null, 1, false),
  ('fish','Fish','చేప','मछली', null, 5, false)
on conflict (code) do nothing;

-- Breeds — India-first
insert into public.breeds (species_code, code, label, origin_region, purpose, avg_305d_yield_l, avg_egg_per_year) values
  ('cattle','gir','Gir','Gujarat',array['milk'],2000,null),
  ('cattle','sahiwal','Sahiwal','Punjab',array['milk'],2500,null),
  ('cattle','red_sindhi','Red Sindhi','Sindh',array['milk'],1800,null),
  ('cattle','ongole','Ongole','Andhra Pradesh',array['draft','milk'],1200,null),
  ('cattle','deoni','Deoni','Marathwada',array['dual'],1200,null),
  ('cattle','tharparkar','Tharparkar','Rajasthan',array['milk'],2200,null),
  ('cattle','hf_cross','HF Cross','cross',array['milk'],4500,null),
  ('cattle','jersey_cross','Jersey Cross','cross',array['milk'],3500,null),
  ('buffalo','murrah','Murrah','Haryana',array['milk'],2600,null),
  ('buffalo','jaffarabadi','Jaffarabadi','Gujarat',array['milk'],2200,null),
  ('buffalo','mehsana','Mehsana','Gujarat',array['milk'],2100,null),
  ('buffalo','surti','Surti','Gujarat',array['milk'],1700,null),
  ('goat','osmanabadi','Osmanabadi','Maharashtra',array['meat','milk'],null,null),
  ('goat','deccani','Deccani','Deccan plateau',array['meat'],null,null),
  ('goat','sirohi','Sirohi','Rajasthan',array['meat','milk'],null,null),
  ('goat','jamunapari','Jamunapari','UP',array['milk','meat'],null,null),
  ('goat','beetal','Beetal','Punjab',array['milk','meat'],null,null),
  ('goat','black_bengal','Black Bengal','Bengal',array['meat'],null,null),
  ('sheep','deccani','Deccani sheep','Deccan plateau',array['meat'],null,null),
  ('sheep','nellore','Nellore','Andhra Pradesh',array['meat'],null,null),
  ('sheep','madras_red','Madras Red','Tamil Nadu',array['meat'],null,null),
  ('poultry','kadaknath','Kadaknath','Madhya Pradesh',array['meat','egg'],null,110),
  ('poultry','giriraja','Giriraja','Karnataka',array['dual'],null,150),
  ('poultry','aseel','Aseel','Andhra Pradesh',array['meat','show'],null,70),
  ('poultry','vanaraja','Vanaraja','ICAR',array['dual'],null,160),
  ('poultry','rhode_red','Rhode Island Red','USA',array['egg'],null,250),
  ('poultry','bv380','BV-380','commercial',array['egg'],null,300),
  ('poultry','cobb500','Cobb 500','commercial',array['meat'],null,null),
  ('poultry','ross308','Ross 308','commercial',array['meat'],null,null),
  ('poultry','country','Country (Naati Koli)','local',array['meat','egg'],null,90)
on conflict (species_code, code) do nothing;

-- Crops (Telangana-relevant)
insert into public.crops (code, label, telugu_label, hindi_label, family, kind, cycle_days_min, cycle_days_max, rotation_partner_codes, water_need_mm) values
  ('rice_basmati','Basmati rice','వరి','चावल','poaceae','cereal',120,150,array['tur','green_gram'],1500),
  ('rice_paddy','Paddy rice','వరి','चावल','poaceae','cereal',110,140,array['tur','green_gram'],1500),
  ('millet_little','Little millet (Samai)','సామలు','कुटकी','poaceae','millet',70,90,array['sunn_hemp','tur'],350),
  ('millet_finger','Finger millet (Ragi)','రాగి','रागी','poaceae','millet',100,125,array['sunn_hemp'],500),
  ('millet_pearl','Pearl millet (Bajra)','సజ్జ','बाजरा','poaceae','millet',75,100,array['cowpea'],400),
  ('sorghum','Sorghum (Jowar)','జొన్న','ज्वार','poaceae','cereal',100,120,array['sunn_hemp'],450),
  ('tur','Red gram / Pigeon pea (Tur)','కంది','अरहर','fabaceae','pulse',150,180,array['sorghum','rice_paddy'],400),
  ('chickpea','Chickpea (Bengal gram)','శనగ','चना','fabaceae','pulse',95,120,array['sorghum'],300),
  ('green_gram','Green gram (Moong)','పెసర','मूंग','fabaceae','pulse',60,75,array['rice_paddy'],300),
  ('black_gram','Black gram (Urad)','మినుము','उड़द','fabaceae','pulse',70,90,array['rice_paddy'],300),
  ('cotton','Cotton','ప‌త్తి','कपास','malvaceae','cash',150,180,array['sorghum','tur'],650),
  ('tomato','Tomato','ట‌మాటా','टमाटर','solanaceae','vegetable',90,120,array['moringa','green_gram'],400),
  ('brinjal','Brinjal (Eggplant)','వంకాయ','बैंगन','solanaceae','vegetable',100,140,array['moringa'],400),
  ('okra','Okra (Lady finger)','బెండకాయ','भिंडी','malvaceae','vegetable',50,70,array['green_gram'],400),
  ('chilli','Chilli','మిరప','मिर्च','solanaceae','spice',120,180,array['moringa'],500),
  ('spinach','Spinach (Palak)','పాలకూర','पालक','amaranthaceae','vegetable',25,45,array['moringa'],200),
  ('coriander','Coriander','కొత్తిమీర','धनिया','apiaceae','spice',30,45,array['tomato'],200),
  ('moringa','Moringa (Drumstick)','మునగ','सहजन','moringaceae','perennial',180,null,array['tomato','chilli'],400),
  ('curry_leaf','Curry leaf','కరివేపాకు','करी पत्ता','rutaceae','perennial',180,null,null,300),
  ('banana','Banana','అరటి','केला','musaceae','fruit',300,380,null,1800),
  ('papaya','Papaya','బొప్పాయి','पपीता','caricaceae','fruit',200,300,null,900),
  ('turmeric','Turmeric','ప‌సుపు','हल्दी','zingiberaceae','spice',240,300,array['green_gram'],1000),
  ('ginger','Ginger','అల్లం','अदरक','zingiberaceae','spice',240,270,array['green_gram'],1300),
  ('sunn_hemp','Sunn hemp (cover)','జనుము','सनई','fabaceae','cover',60,90,null,400),
  ('cowpea','Cowpea (cover / fodder)','అలసంద','लोबिया','fabaceae','fodder',75,90,null,350),
  ('mango','Mango','మామిడి','आम','anacardiaceae','perennial',null,null,null,1000)
on conflict (code) do nothing;

-- Certifying bodies
insert into public.certification_bodies (code, label, scheme, scope) values
  ('pgs_india','PGS-India','PGS-India','national'),
  ('npop','NPOP','NPOP','national'),
  ('fssai','FSSAI','FSSAI','national'),
  ('apeda_organic','APEDA Organic','APEDA','export')
on conflict (code) do nothing;

-- Subsidy schemes
insert into public.subsidy_schemes (code, label, authority, scope, state, frequency, max_amount) values
  ('ts_rythu_bandhu','Rythu Bandhu (investment support)','TS Agriculture Dept','state','Telangana','semi_annual',10000),
  ('central_pmkisan','PM-KISAN income support','MoA','central',null,'tri_annual',6000),
  ('central_pmksy_drip','PMKSY drip irrigation 55% subsidy','MoA','central',null,'one_time',500000),
  ('nabard_dairy_dehm','NABARD Dairy Entrepreneurship scheme','NABARD','central',null,'one_time',1000000),
  ('nabard_interest_subvention','NABARD interest subvention (dairy)','NABARD','central',null,'annual',100000),
  ('ts_organic_mission','Telangana Organic Mission cert grant','TS Agriculture Dept','state','Telangana','annual',25000),
  ('ts_goat_scheme','Telangana sheep/goat distribution scheme','TS Animal Husbandry','state','Telangana','one_time',125000),
  ('poultry_kadaknath_promotion','Kadaknath poultry promotion','TS Animal Husbandry','state','Telangana','annual',50000),
  ('central_rkvy_organic','RKVY organic cluster','MoA','central',null,'annual',50000),
  ('central_apmc_bio_input','Bio-input / FPO support','MoA','central',null,'annual',100000)
on conflict (code) do nothing;
