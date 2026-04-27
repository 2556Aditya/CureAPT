"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as d3 from "d3"

const FOODS = [
  {id:1,  name:"Greek Salad",        emoji:"🥗", desc:"Crisp cucumbers, tomatoes, olives and feta in cold-pressed olive oil",     cal:180, protein:6,  carbs:12, fat:13, health:88, swap:null},
  {id:2,  name:"Grilled Salmon",     emoji:"🐟", desc:"Wild-caught Atlantic salmon fillet with lemon and rosemary",               cal:280, protein:39, carbs:0,  fat:13, health:95, swap:null},
  {id:3,  name:"Quinoa Bowl",        emoji:"🥣", desc:"Protein-rich quinoa with roasted seasonal vegetables and tahini drizzle",  cal:320, protein:14, carbs:45, fat:8,  health:90, swap:null},
  {id:4,  name:"Avocado Toast",      emoji:"🥑", desc:"Whole grain toast with smashed avocado, seeds and chilli flakes",         cal:290, protein:9,  carbs:28, fat:18, health:82, swap:null},
  {id:5,  name:"Edamame",            emoji:"🌿", desc:"Steamed young soybeans with fleur de sel",                                 cal:120, protein:11, carbs:9,  fat:5,  health:92, swap:null},
  {id:6,  name:"Miso Soup",          emoji:"🍵", desc:"Fermented soybean broth with silken tofu and wakame seaweed",             cal:40,  protein:3,  carbs:5,  fat:1,  health:85, swap:null},
  {id:7,  name:"Sashimi Platter",    emoji:"🍣", desc:"Premium sliced raw fish, rich in omega-3 fatty acids",                    cal:200, protein:34, carbs:0,  fat:6,  health:97, swap:null},
  {id:8,  name:"Grilled Chicken",    emoji:"🍗", desc:"Lean chicken breast with garlic, rosemary and a squeeze of lemon",        cal:230, protein:43, carbs:0,  fat:5,  health:91, swap:null},
  {id:9,  name:"Lentil Soup",        emoji:"🍲", desc:"Hearty red lentils simmered with turmeric, cumin and coriander",          cal:230, protein:18, carbs:40, fat:1,  health:89, swap:null},
  {id:10, name:"Acai Bowl",          emoji:"🫐", desc:"Frozen acai base crowned with mixed berries, banana and granola",         cal:340, protein:8,  carbs:58, fat:7,  health:80, swap:null},
  {id:11, name:"Oatmeal",            emoji:"🌾", desc:"Steel-cut oats with raw honey, cinnamon and seasonal fruit",              cal:300, protein:10, carbs:54, fat:5,  health:83, swap:null},
  {id:12, name:"Poached Eggs",       emoji:"🥚", desc:"Perfectly poached eggs on a bed of wilted spinach and sourdough",        cal:150, protein:12, carbs:1,  fat:10, health:85, swap:null},
  {id:13, name:"Veggie Wrap",        emoji:"🌯", desc:"Whole wheat wrap with hummus, roasted peppers and rocket",                cal:310, protein:12, carbs:48, fat:8,  health:78, swap:null},
  {id:14, name:"Tuna Poke Bowl",     emoji:"🍱", desc:"Fresh ahi tuna over sushi rice with edamame, cucumber and sesame",        cal:430, protein:35, carbs:50, fat:9,  health:85, swap:null},
  {id:15, name:"Hummus Plate",       emoji:"🫘", desc:"House-made chickpea hummus with crudites and warm toasted pita",          cal:270, protein:10, carbs:32, fat:12, health:80, swap:null},
  {id:16, name:"Fruit Salad",        emoji:"🍓", desc:"Seasonal mixed fruits with fresh mint and a drizzle of honey",            cal:130, protein:2,  carbs:32, fat:0,  health:93, swap:null},
  {id:17, name:"Turkey Sandwich",    emoji:"🥪", desc:"Lean sliced turkey with Dijon mustard on multigrain sourdough",           cal:320, protein:28, carbs:36, fat:7,  health:76, swap:null},
  {id:18, name:"Gazpacho",           emoji:"🍅", desc:"Chilled Andalusian tomato soup blended with cucumber and peppers",        cal:90,  protein:2,  carbs:15, fat:3,  health:88, swap:null},
  {id:19, name:"Spinach Salad",      emoji:"🥬", desc:"Baby spinach with candied walnuts, dried cranberries and balsamic",       cal:210, protein:7,  carbs:14, fat:15, health:87, swap:null},
  {id:20, name:"Black Bean Tacos",   emoji:"🌮", desc:"Spiced black beans with fresh mango salsa and guacamole",                 cal:350, protein:16, carbs:50, fat:10, health:79, swap:null},
  {id:21, name:"Tempeh Bowl",        emoji:"🥙", desc:"Marinated tempeh over brown rice with wilted greens and miso dressing",   cal:380, protein:22, carbs:44, fat:12, health:84, swap:null},
  {id:22, name:"Cucumber Rolls",     emoji:"🥒", desc:"Thin cucumber wrapped around smoked salmon and cream cheese",             cal:180, protein:4,  carbs:36, fat:3,  health:86, swap:null},
  {id:23, name:"Cauliflower Soup",   emoji:"🥦", desc:"Silky blended cauliflower with nutmeg, toasted almonds and cream",        cal:160, protein:5,  carbs:22, fat:6,  health:82, swap:null},
  {id:24, name:"Baked Cod",          emoji:"🐠", desc:"Herb-crusted Atlantic cod fillet with lemon, capers and dill",            cal:190, protein:35, carbs:4,  fat:4,  health:93, swap:null},
  {id:25, name:"Chickpea Curry",     emoji:"🍛", desc:"Slow-cooked chickpeas in fragrant tomato and coconut masala",             cal:310, protein:15, carbs:45, fat:7,  health:81, swap:null},
  {id:26, name:"Margherita Pizza",   emoji:"🍕", desc:"Classic Neapolitan with San Marzano tomato and buffalo mozzarella",       cal:285, protein:12, carbs:36, fat:10, health:55, swap:"Cauliflower crust saves 80 kcal"},
  {id:27, name:"Tikka Masala",       emoji:"🍛", desc:"Tender chicken bathed in a smoky, creamy tomato sauce",                  cal:400, protein:35, carbs:18, fat:20, health:58, swap:"Yogurt-based sauce saves 120 kcal"},
  {id:28, name:"Beef Burger",        emoji:"🍔", desc:"Classic beef patty with aged cheddar, lettuce and tomato",               cal:540, protein:30, carbs:44, fat:26, health:45, swap:"Turkey burger saves 150 kcal"},
  {id:29, name:"Pad Thai",           emoji:"🍜", desc:"Rice noodles with shrimp, peanuts, egg and tamarind sauce",              cal:480, protein:22, carbs:62, fat:17, health:52, swap:"Zucchini noodle version saves 200 kcal"},
  {id:30, name:"Fish Tacos",         emoji:"🌮", desc:"Beer-battered white fish with cabbage slaw and chipotle crema",          cal:380, protein:24, carbs:38, fat:14, health:60, swap:null},
  {id:31, name:"California Roll",    emoji:"🍣", desc:"Snow crab, avocado and cucumber in toasted sesame maki",                 cal:250, protein:9,  carbs:38, fat:7,  health:62, swap:null},
  {id:32, name:"Pasta Carbonara",    emoji:"🍝", desc:"Spaghetti with guanciale, egg yolk and aged Pecorino Romano",            cal:550, protein:22, carbs:68, fat:20, health:43, swap:"Courgette carbonara saves 180 kcal"},
  {id:33, name:"Chicken Fried Rice", emoji:"🍚", desc:"Wok-tossed jasmine rice with chicken, egg and Chinese five spice",       cal:420, protein:24, carbs:56, fat:10, health:55, swap:"Cauliflower rice saves 150 kcal"},
  {id:34, name:"Cheese Omelette",    emoji:"🍳", desc:"Three-egg omelette with aged Comte and fresh chives",                    cal:320, protein:22, carbs:2,  fat:24, health:60, swap:null},
  {id:35, name:"French Onion Soup",  emoji:"🧅", desc:"Deeply caramelized onions in beef broth with Gruyere crouton",          cal:380, protein:12, carbs:42, fat:16, health:50, swap:null},
  {id:36, name:"Grilled Cheese",     emoji:"🧀", desc:"Sourdough with cave-aged cheddar, pan-fried in cultured butter",        cal:430, protein:16, carbs:38, fat:24, health:41, swap:"Open-face with light cheese saves 120 kcal"},
  {id:37, name:"Tom Yum Soup",       emoji:"🍲", desc:"Fiery Thai broth with tiger prawns, lemongrass and kaffir lime",        cal:180, protein:14, carbs:18, fat:4,  health:68, swap:null},
  {id:38, name:"Beef Stew",          emoji:"🥩", desc:"Slow-braised chuck with root vegetables, red wine and thyme",           cal:420, protein:32, carbs:28, fat:18, health:57, swap:null},
  {id:39, name:"Lamb Kebab",         emoji:"🍢", desc:"Spiced minced lamb on skewers, served with flatbread and tzatziki",     cal:450, protein:28, carbs:32, fat:22, health:52, swap:null},
  {id:40, name:"Pho",                emoji:"🍜", desc:"Vietnamese pho with 12-hour bone broth, rice noodles and fresh herbs",  cal:350, protein:24, carbs:48, fat:6,  health:66, swap:null},
  {id:41, name:"Chicken Shawarma",   emoji:"🥙", desc:"Marinated rotisserie chicken with toum, pickled turnip and parsley",    cal:480, protein:36, carbs:42, fat:16, health:58, swap:null},
  {id:42, name:"Mushroom Risotto",   emoji:"🍄", desc:"Arborio rice with porcini, parmesan and a splash of white wine",        cal:430, protein:12, carbs:62, fat:14, health:50, swap:null},
  {id:43, name:"Falafel Wrap",       emoji:"🫓", desc:"Crispy chickpea falafel with tahini, fresh greens and pickled veg",     cal:420, protein:16, carbs:58, fat:14, health:62, swap:null},
  {id:44, name:"BBQ Chicken",        emoji:"🍗", desc:"Smoky slow-cooked chicken thighs glazed with molasses BBQ sauce",       cal:380, protein:38, carbs:20, fat:14, health:60, swap:null},
  {id:45, name:"Club Sandwich",      emoji:"🥪", desc:"Triple-decker with turkey, streaky bacon, avocado and tomato",          cal:560, protein:34, carbs:48, fat:24, health:47, swap:"Single layer no bacon saves 180 kcal"},
  {id:46, name:"Chicken Biryani",    emoji:"🍚", desc:"Fragrant saffron basmati layered with tender spiced chicken",           cal:520, protein:30, carbs:68, fat:14, health:55, swap:null},
  {id:47, name:"Quesadilla",         emoji:"🫔", desc:"Crispy flour tortilla with melted cheese and grilled chicken",          cal:460, protein:28, carbs:40, fat:20, health:50, swap:"Corn tortilla version saves 60 kcal"},
  {id:48, name:"Beef Stir Fry",      emoji:"🥩", desc:"Tender sirloin strips with bok choy and broccolini in oyster sauce",   cal:380, protein:30, carbs:28, fat:16, health:58, swap:null},
  {id:49, name:"Lobster Bisque",     emoji:"🦞", desc:"Velvety cream soup with fresh Maine lobster and cognac",                cal:420, protein:18, carbs:22, fat:28, health:44, swap:null},
  {id:50, name:"Tonkotsu Ramen",     emoji:"🍜", desc:"18-hour pork bone broth with soft egg, chashu and bamboo shoots",       cal:550, protein:26, carbs:62, fat:18, health:48, swap:null},
  {id:51, name:"Pepperoni Pizza",    emoji:"🍕", desc:"Loaded with spicy pepperoni, extra mozzarella and fresh basil",        cal:400, protein:18, carbs:40, fat:20, health:32, swap:"Veggie pizza saves 100 kcal"},
  {id:52, name:"Double Cheeseburger",emoji:"🍔", desc:"Two smash-stacked beef patties with double cheddar and dijonnaise",    cal:760, protein:44, carbs:50, fat:44, health:22, swap:"Single turkey burger saves 350 kcal"},
  {id:53, name:"Fried Chicken",      emoji:"🍗", desc:"Southern-style crispy buttermilk-battered deep-fried chicken",         cal:520, protein:34, carbs:28, fat:28, health:28, swap:"Baked chicken strips saves 200 kcal"},
  {id:54, name:"Mac and Cheese",     emoji:"🧀", desc:"Creamy elbow pasta in a rich four-cheese mornay sauce",                cal:490, protein:18, carbs:58, fat:22, health:30, swap:"Cauliflower mac saves 160 kcal"},
  {id:55, name:"Chocolate Cake",     emoji:"🎂", desc:"Decadent dark chocolate layer cake with ganache frosting",              cal:480, protein:6,  carbs:64, fat:24, health:18, swap:"Dark chocolate mousse saves 200 kcal"},
  {id:56, name:"French Fries",       emoji:"🍟", desc:"Deep-fried golden potato strips with fleur de sel",                    cal:360, protein:4,  carbs:46, fat:18, health:20, swap:"Baked sweet potato fries saves 120 kcal"},
  {id:57, name:"Glazed Donuts",      emoji:"🍩", desc:"Pillowy deep-fried dough rings with vanilla sugar glaze",              cal:290, protein:4,  carbs:38, fat:14, health:15, swap:"Baked mini donuts saves 120 kcal"},
  {id:58, name:"Ice Cream Sundae",   emoji:"🍨", desc:"Three scoops with hot fudge, roasted nuts and whipped cream",          cal:560, protein:8,  carbs:76, fat:24, health:14, swap:"Frozen yogurt bowl saves 250 kcal"},
  {id:59, name:"Loaded Nachos",      emoji:"🫔", desc:"Tortilla chips with queso, jalapenos, guacamole and sour cream",       cal:680, protein:22, carbs:58, fat:38, health:18, swap:"Baked chips with salsa saves 300 kcal"},
  {id:60, name:"Chicken Nuggets",    emoji:"🍗", desc:"Golden crispy battered chicken bites with dipping sauces",             cal:440, protein:26, carbs:30, fat:24, health:26, swap:"Baked chicken bites saves 160 kcal"},
  {id:61, name:"Milkshake",          emoji:"🥤", desc:"Thick creamy vanilla shake with whipped cream and a maraschino cherry", cal:580, protein:10, carbs:86, fat:22, health:12, swap:"Banana protein smoothie saves 320 kcal"},
  {id:62, name:"NY Cheesecake",      emoji:"🍰", desc:"Dense New York cream cheese on a buttered graham cracker crust",       cal:490, protein:8,  carbs:46, fat:30, health:16, swap:"Greek yogurt cheesecake saves 200 kcal"},
  {id:63, name:"Buffalo Wings",      emoji:"🍖", desc:"Deep-fried wings tossed in hot sauce and butter",                     cal:580, protein:42, carbs:14, fat:38, health:24, swap:"Baked cauliflower wings saves 350 kcal"},
  {id:64, name:"Onion Rings",        emoji:"🧅", desc:"Beer-battered deep-fried onion rings with chipotle ranch dip",         cal:410, protein:6,  carbs:50, fat:20, health:18, swap:"Baked zucchini rings saves 180 kcal"},
  {id:65, name:"Banana Split",       emoji:"🍌", desc:"Three scoops of ice cream over a split banana with caramel",           cal:720, protein:10, carbs:98, fat:30, health:14, swap:"Frozen banana with dark choc saves 450 kcal"},
  {id:66, name:"Churros",            emoji:"🍫", desc:"Crispy fried dough with cinnamon sugar and warm chocolate sauce",      cal:370, protein:4,  carbs:52, fat:16, health:18, swap:"Baked cinnamon strips saves 150 kcal"},
  {id:67, name:"Deep Dish Pizza",    emoji:"🍕", desc:"Chicago-style two-inch thick crust piled with meats and cheese",       cal:640, protein:26, carbs:62, fat:32, health:22, swap:"Thin crust veggie pizza saves 300 kcal"},
  {id:68, name:"Pulled Pork Bun",    emoji:"🥩", desc:"Slow-smoked pork shoulder with house BBQ sauce on a brioche bun",     cal:620, protein:38, carbs:58, fat:24, health:28, swap:"Jackfruit sandwich saves 200 kcal"},
  {id:69, name:"Fried Calamari",     emoji:"🦑", desc:"Golden crispy squid rings and tentacles with lemon and marinara",      cal:380, protein:18, carbs:38, fat:18, health:30, swap:"Grilled calamari saves 180 kcal"},
  {id:70, name:"Sticky Toffee Pud",  emoji:"🍮", desc:"Warm Medjool date sponge drenched in butterscotch toffee sauce",       cal:520, protein:6,  carbs:72, fat:22, health:12, swap:"Date and oat energy balls saves 300 kcal"},
  {id:71, name:"Cheese Fries",       emoji:"🍟", desc:"Crinkle-cut fries loaded with queso and pickled jalapenos",            cal:560, protein:14, carbs:60, fat:30, health:16, swap:"Sweet potato with feta saves 280 kcal"},
  {id:72, name:"Beef Lasagna",       emoji:"🍝", desc:"Classic layered pasta with slow-braised bolognese and bechamel",       cal:540, protein:28, carbs:56, fat:22, health:35, swap:"Zucchini noodle lasagna saves 200 kcal"},
  {id:73, name:"Pecan Pie",          emoji:"🥧", desc:"Rich dark molasses filling with caramelized toasted pecan halves",     cal:500, protein:6,  carbs:62, fat:26, health:14, swap:"Pecan date energy bars saves 300 kcal"},
  {id:74, name:"Cinnamon Roll",      emoji:"🍞", desc:"Soft enriched dough swirled with cinnamon butter and cream cheese",    cal:420, protein:6,  carbs:66, fat:14, health:16, swap:"Oat cinnamon muffin saves 180 kcal"},
  {id:75, name:"Belgian Waffles",    emoji:"🧇", desc:"Crispy pearl-sugar waffles with whipped cream and maple syrup",        cal:480, protein:8,  carbs:70, fat:18, health:25, swap:"Whole grain waffles saves 150 kcal"},
  {id:76, name:"Creme Brulee",       emoji:"🍮", desc:"Silky Tahitian vanilla custard under a glass of caramelized sugar",   cal:380, protein:6,  carbs:38, fat:22, health:28, swap:null},
  {id:77, name:"Tiramisu",           emoji:"🎂", desc:"Espresso-soaked savoiardi with mascarpone and dusted cocoa",           cal:450, protein:7,  carbs:50, fat:22, health:30, swap:"Light tiramisu saves 150 kcal"},
  {id:78, name:"Butter Croissant",   emoji:"🥐", desc:"Perfectly laminated French pastry, flaky and deeply golden",           cal:340, protein:6,  carbs:38, fat:18, health:30, swap:"Whole grain toast saves 180 kcal"},
  {id:79, name:"Hot Dog",            emoji:"🌭", desc:"Beef frankfurter with yellow mustard, ketchup and sweet relish",       cal:490, protein:18, carbs:42, fat:26, health:22, swap:"Turkey dog with mustard saves 180 kcal"},
  {id:80, name:"Pancake Stack",      emoji:"🥞", desc:"Fluffy buttermilk pancakes stacked high with maple syrup and butter",  cal:520, protein:10, carbs:82, fat:16, health:28, swap:"Oat banana pancakes saves 200 kcal"},
]

const MEAL_SEARCH = {
  "Greek Salad":"Greek","Grilled Salmon":"Salmon","Quinoa Bowl":"Quinoa",
  "Avocado Toast":"Avocado","Edamame":"Edamame","Miso Soup":"Miso",
  "Sashimi Platter":"Sushi","Grilled Chicken":"Chicken","Lentil Soup":"Lentil",
  "Acai Bowl":"Berry","Oatmeal":"Porridge","Poached Eggs":"Eggs",
  "Veggie Wrap":"Wrap","Tuna Poke Bowl":"Tuna","Hummus Plate":"Hummus",
  "Fruit Salad":"Fruit","Turkey Sandwich":"Turkey","Gazpacho":"Gazpacho",
  "Spinach Salad":"Spinach","Black Bean Tacos":"Tacos","Tempeh Bowl":"Tempeh",
  "Cucumber Rolls":"Sushi","Cauliflower Soup":"Cauliflower","Baked Cod":"Cod",
  "Chickpea Curry":"Chickpea","Margherita Pizza":"Margherita","Tikka Masala":"Tikka",
  "Beef Burger":"Burger","Pad Thai":"Pad Thai","Fish Tacos":"Fish",
  "California Roll":"Sushi","Pasta Carbonara":"Carbonara","Chicken Fried Rice":"Fried Rice",
  "Cheese Omelette":"Omelette","French Onion Soup":"Onion Soup","Grilled Cheese":"Cheese",
  "Tom Yum Soup":"Tom Yum","Beef Stew":"Beef Stew","Lamb Kebab":"Kebab",
  "Pho":"Pho","Chicken Shawarma":"Shawarma","Mushroom Risotto":"Risotto",
  "Falafel Wrap":"Falafel","BBQ Chicken":"BBQ","Club Sandwich":"Sandwich",
  "Chicken Biryani":"Biryani","Quesadilla":"Quesadilla","Beef Stir Fry":"Stir Fry",
  "Lobster Bisque":"Lobster","Tonkotsu Ramen":"Ramen","Pepperoni Pizza":"Pizza",
  "Double Cheeseburger":"Burger","Fried Chicken":"Fried Chicken","Mac and Cheese":"Macaroni",
  "Chocolate Cake":"Chocolate Cake","French Fries":"Chips","Glazed Donuts":"Donuts",
  "Ice Cream Sundae":"Ice Cream","Loaded Nachos":"Nachos","Chicken Nuggets":"Chicken",
  "Milkshake":"Shake","NY Cheesecake":"Cheesecake","Buffalo Wings":"Wings",
  "Onion Rings":"Onion","Banana Split":"Banana","Churros":"Churros",
  "Deep Dish Pizza":"Pizza","Pulled Pork Bun":"Pulled Pork","Fried Calamari":"Calamari",
  "Sticky Toffee Pud":"Toffee","Cheese Fries":"Chips","Beef Lasagna":"Lasagne",
  "Pecan Pie":"Pecan","Cinnamon Roll":"Cinnamon","Belgian Waffles":"Waffles",
  "Creme Brulee":"Creme Brulee","Tiramisu":"Tiramisu","Butter Croissant":"Croissant",
  "Hot Dog":"Hot Dog","Pancake Stack":"Pancakes",
}

const hColor = s => s >= 70 ? [34,197,94] : s >= 40 ? [234,179,8] : [239,68,68]
const rgba = ([r,g,b], a=1) => `rgba(${r},${g},${b},${a})`
const strs = n => '★'.repeat(n) + '☆'.repeat(5-n)
const chunk = (arr,n) => { const o=[]; for(let i=0;i<arr.length;i+=n) o.push(arr.slice(i,i+n)); return o }

function toOffscreen(img, size, blurPx=0) {
  const oc=document.createElement('canvas'); oc.width=size; oc.height=size
  const c=oc.getContext('2d')
  if(blurPx>0){ c.filter=`blur(${blurPx}px)`; c.drawImage(img,-blurPx*2,-blurPx*2,size+blurPx*4,size+blurPx*4); c.filter='none' }
  else { c.drawImage(img,0,0,size,size) }
  return oc
}

function buildEmojiOC(emoji) {
  const oc=document.createElement('canvas'); oc.width=96; oc.height=96
  const c=oc.getContext('2d')
  c.font='72px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif'
  c.textAlign='center'; c.textBaseline='middle'; c.fillText(emoji,48,52)
  return oc
}

async function fetchFoodImages(foods, onProgress) {
  const cache=new Map(); let done=0
  for(const batch of chunk(foods,8)){
    await Promise.allSettled(batch.map(async food=>{
      try{
        const q=encodeURIComponent(MEAL_SEARCH[food.name]||food.name)
        const res=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`)
        const data=await res.json()
        const url=data?.meals?.[0]?.strMealThumb
        if(url){
          const img=new Image(); img.crossOrigin='anonymous'
          await new Promise((res,rej)=>{ img.onload=res; img.onerror=rej; img.src=url })
          cache.set(food.id,{ sharp:toOffscreen(img,320,0), blurred:toOffscreen(img,320,10) })
        }
      } catch(_){}
      done++; onProgress(done/foods.length)
    }))
  }
  return cache
}

function Card({food,pos}){
  const col=hColor(food.health)
  const x=Math.min(pos.x+22,window.innerWidth-320)
  const y=Math.max(16,Math.min(pos.y-70,window.innerHeight-440))
  const sc=Math.round(food.health/20)
  return(
    <div style={{position:'fixed',left:x,top:y,width:294,zIndex:200,
      background:'rgba(4,4,4,0.97)',backdropFilter:'blur(32px)',WebkitBackdropFilter:'blur(32px)',
      border:`1px solid ${rgba(col,0.22)}`,borderRadius:14,padding:'18px 20px',pointerEvents:'none',
      boxShadow:`0 0 90px ${rgba(col,0.1)},inset 0 1px 0 rgba(255,255,255,0.04)`,
      fontFamily:"'Cormorant Garamond',Georgia,serif",color:'#fff'}}>
      <div style={{display:'flex',gap:13,alignItems:'flex-start',marginBottom:13}}>
        <div style={{fontSize:36,lineHeight:1}}>{food.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:17,fontWeight:600,letterSpacing:'0.02em',lineHeight:1.2,marginBottom:4}}>{food.name}</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:rgba(col,.85),letterSpacing:'0.08em'}}>{strs(sc)}&nbsp;&nbsp;{food.health}/100</div>
        </div>
      </div>
      <div style={{fontSize:11.5,color:'#5a5a5a',lineHeight:1.65,marginBottom:13,paddingBottom:13,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>{food.desc}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:7,marginBottom:12}}>
        <span style={{fontSize:30,fontWeight:300,color:rgba(col,1),letterSpacing:'-0.02em'}}>{food.cal}</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#3a3a3a',letterSpacing:'0.18em'}}>KCAL</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:13}}>
        {[{l:'PROTEIN',v:`${food.protein}g`,c:'#60a5fa'},{l:'CARBS',v:`${food.carbs}g`,c:'#fbbf24'},{l:'FAT',v:`${food.fat}g`,c:'#c084fc'}].map(({l,v,c})=>(
          <div key={l} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.055)',borderRadius:8,padding:'7px 10px'}}>
            <div style={{fontSize:15,color:c,marginBottom:2}}>{v}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:'#333',letterSpacing:'0.14em'}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:food.swap?12:0}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:'#2e2e2e',letterSpacing:'0.14em'}}>HEALTH SCORE</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:rgba(col,.85)}}>{food.health}/100</span>
        </div>
        <div style={{height:2,background:'rgba(255,255,255,0.06)',borderRadius:1,overflow:'hidden'}}>
          <div style={{width:`${food.health}%`,height:'100%',background:`linear-gradient(90deg,${rgba(col,.35)},${rgba(col,1)})`,borderRadius:1}}/>
        </div>
      </div>
      {food.swap&&(
        <div style={{marginTop:12,padding:'9px 12px',background:rgba(col,.06),borderLeft:`2px solid ${rgba(col,.38)}`,borderRadius:'0 8px 8px 0',fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'#5a5a5a',lineHeight:1.55}}>
          <span style={{color:rgba(col,.9)}}>💡 </span>{food.swap}
        </div>
      )}
    </div>
  )
}

function LoadingScreen({pct,currentFood}){
  return(
    <div style={{position:'fixed',inset:0,background:'#000',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',zIndex:300,fontFamily:"'DM Mono',monospace"}}>
      <div style={{fontSize:28,letterSpacing:'0.5em',color:'rgba(255,255,255,0.2)',marginBottom:48}}>NOURISH</div>
      <div style={{width:240,height:1,background:'rgba(255,255,255,0.07)',borderRadius:1,marginBottom:20,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${Math.round(pct*100)}%`,
          background:'linear-gradient(90deg,rgba(34,197,94,0.3),rgba(34,197,94,0.9))',transition:'width 0.25s ease'}}/>
      </div>
      <div style={{fontSize:8,letterSpacing:'0.5em',color:'rgba(255,255,255,0.15)',marginBottom:14}}>
        {String(Math.round(pct*100)).padStart(3,' ')}% — LOADING FOOD IMAGES
      </div>
      {currentFood&&<div style={{fontSize:9,letterSpacing:'0.22em',color:'rgba(255,255,255,0.2)'}}>{currentFood.toUpperCase()}</div>}
    </div>
  )
}

export default function FoodVoronoi(){
  const canvasRef  =useRef(null)
  const nodesRef   =useRef([])
  const delRef     =useRef(null)
  const hiRef      =useRef(-1)
  const rafRef     =useRef(null)
  const dimsRef    =useRef({w:900,h:600})
  const imgCacheRef=useRef(new Map())
  const emojiFbRef =useRef(new Map())

  const [hFood,       setHFood]      =useState(null)
  const [mPos,        setMPos]       =useState({x:0,y:0})
  const [loadPct,     setLoadPct]    =useState(0)
  const [loadCurrent, setLoadCurrent]=useState('')
  const [loading,     setLoading]    =useState(true)
  const [fontsReady,  setFontsReady] =useState(false)

  useEffect(()=>{
    document.body.style.cssText='margin:0;padding:0;overflow:hidden;background:#000'
    document.documentElement.style.background='#000'
    const link=document.createElement('link')
    link.rel='stylesheet'
    link.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap'
    link.onload=()=>setFontsReady(true)
    document.head.appendChild(link)
    return()=>{ try{document.head.removeChild(link)}catch(_){} }
  },[])

  useEffect(()=>{
    FOODS.forEach(f=>emojiFbRef.current.set(f.id,buildEmojiOC(f.emoji)))
  },[])

  useEffect(()=>{
    fetchFoodImages(FOODS,(pct)=>{
      setLoadPct(pct)
      const i=Math.min(Math.floor(pct*FOODS.length),FOODS.length-1)
      setLoadCurrent(FOODS[i]?.name||'')
    }).then(cache=>{
      imgCacheRef.current=cache
      setTimeout(()=>setLoading(false),400)
    })
  },[])

  useEffect(()=>{
    const w=window.innerWidth,h=window.innerHeight
    dimsRef.current={w,h}
    const nodes=FOODS.map(f=>({...f,x:60+Math.random()*(w-120),y:60+Math.random()*(h-120)}))
    nodesRef.current=nodes
    const sim=d3.forceSimulation(nodes)
      .force('charge',d3.forceManyBody().strength(-170))
      .force('collision',d3.forceCollide(52))
      .force('cx',d3.forceX(w/2).strength(0.022))
      .force('cy',d3.forceY(h/2).strength(0.022))
      .alphaDecay(0.0025).velocityDecay(0.42)
    const breathe=setInterval(()=>{
      nodes.forEach(n=>{n.vx+=(Math.random()-.5)*1.4;n.vy+=(Math.random()-.5)*1.4})
      sim.alpha(Math.max(sim.alpha(),.06)).restart()
    },2800)
    const onResize=()=>{
      const nw=window.innerWidth,nh=window.innerHeight
      dimsRef.current={w:nw,h:nh}
      sim.force('cx',d3.forceX(nw/2).strength(0.022)).force('cy',d3.forceY(nh/2).strength(0.022)).alpha(0.2).restart()
    }
    window.addEventListener('resize',onResize)
    return()=>{sim.stop();clearInterval(breathe);window.removeEventListener('resize',onResize)}
  },[])

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return
    const ctx=canvas.getContext('2d')
    const dpr=Math.min(window.devicePixelRatio||1,2)
    const IMG_SZ=340

    const draw=()=>{
      const nodes=nodesRef.current
      const {w,h}=dimsRef.current
      const imgCache=imgCacheRef.current
      const emojiFb=emojiFbRef.current
      const tw=Math.round(w*dpr),th=Math.round(h*dpr)
      if(canvas.width!==tw||canvas.height!==th){
        canvas.width=tw;canvas.height=th;canvas.style.width=w+'px';canvas.style.height=h+'px'
      }
      ctx.setTransform(dpr,0,0,dpr,0,0)
      ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h)
      if(!nodes.length){rafRef.current=requestAnimationFrame(draw);return}

      const del=d3.Delaunay.from(nodes.map(n=>[n.x,n.y]))
      const vor=del.voronoi([0,0,w,h])
      delRef.current=del
      const hi=hiRef.current,hasHi=hi!==-1

      nodes.forEach((nd,i)=>{
        const isHov=i===hi,col=hColor(nd.health),imgs=imgCache.get(nd.id)
        ctx.save(); ctx.beginPath(); vor.renderCell(i,ctx); ctx.clip()
        if(imgs){
          ctx.globalAlpha=isHov?1.0:hasHi?0.3:0.75
          ctx.drawImage(isHov?imgs.sharp:imgs.blurred,nd.x-IMG_SZ/2,nd.y-IMG_SZ/2,IMG_SZ,IMG_SZ)
          ctx.globalAlpha=1
          const gr=ctx.createRadialGradient(nd.x,nd.y,0,nd.x,nd.y,IMG_SZ*.65)
          gr.addColorStop(0,rgba(col,isHov?0.32:hasHi?0.04:0.2)); gr.addColorStop(1,'rgba(0,0,0,0)')
          ctx.fillStyle=gr; ctx.fillRect(0,0,w,h)
          if(!isHov){ctx.fillStyle=hasHi?'rgba(0,0,0,0.58)':'rgba(0,0,0,0.18)';ctx.fillRect(0,0,w,h)}
        } else {
          const gr=ctx.createRadialGradient(nd.x,nd.y,0,nd.x,nd.y,165)
          if(isHov){gr.addColorStop(0,rgba(col,.72));gr.addColorStop(.4,rgba(col,.18));gr.addColorStop(1,'rgba(0,0,0,0.97)')}
          else if(hasHi){gr.addColorStop(0,rgba(col,.05));gr.addColorStop(1,'rgba(0,0,0,1)')}
          else{gr.addColorStop(0,rgba(col,.32));gr.addColorStop(.5,rgba(col,.09));gr.addColorStop(1,'rgba(0,0,0,0.97)')}
          ctx.fillStyle=gr; ctx.fillRect(0,0,w,h)
          const oc=emojiFb.get(nd.id)
          if(oc){
            const fs=isHov?60:30; ctx.globalAlpha=isHov?1:hasHi?.18:.55
            if(isHov){ctx.shadowColor=rgba(col,.5);ctx.shadowBlur=18}
            ctx.drawImage(oc,nd.x-fs/2,nd.y-fs/2,fs,fs)
            ctx.globalAlpha=1;ctx.shadowBlur=0
          }
        }
        ctx.restore()
      })

      nodes.forEach((nd,i)=>{
        const isHov=i===hi,col=hColor(nd.health)
        ctx.save(); ctx.beginPath(); vor.renderCell(i,ctx)
        if(isHov){ctx.strokeStyle=rgba(col,.9);ctx.lineWidth=1.8;ctx.shadowColor=rgba(col,.6);ctx.shadowBlur=20}
        else{ctx.strokeStyle=rgba(col,hasHi?.06:.18);ctx.lineWidth=.5}
        ctx.stroke(); ctx.restore()
      })

      const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.2,w/2,h/2,Math.max(w,h)*.72)
      vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.65)')
      ctx.fillStyle=vg; ctx.fillRect(0,0,w,h)
      rafRef.current=requestAnimationFrame(draw)
    }
    draw()
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current)}
  },[])

  const onMove=useCallback(e=>{
    if(!delRef.current)return
    const rect=canvasRef.current.getBoundingClientRect()
    const idx=delRef.current.find(e.clientX-rect.left,e.clientY-rect.top)
    hiRef.current=idx
    setHFood(idx>=0?nodesRef.current[idx]:null)
    setMPos({x:e.clientX,y:e.clientY})
  },[])
  const onLeave=useCallback(()=>{hiRef.current=-1;setHFood(null)},[])

  return(
    <div style={{position:'relative',width:'100vw',height:'100vh',background:'#000',overflow:'hidden',cursor:'crosshair'}}>
      {loading&&<LoadingScreen pct={loadPct} currentFood={loadCurrent}/>}
      <canvas ref={canvasRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{display:'block',position:'absolute',inset:0}}/>
      {fontsReady&&(
        <div style={{position:'absolute',top:0,left:0,right:0,padding:'26px 36px',
          background:'linear-gradient(to bottom,rgba(0,0,0,0.72) 0%,transparent 100%)',pointerEvents:'none',zIndex:30}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'0.42em',color:'rgba(255,255,255,0.28)',marginBottom:5}}>Health Universe</div>
          <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:33,fontWeight:300,letterSpacing:'0.13em',color:'rgba(255,255,255,0.85)'}}>NOURISH</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'0.18em',color:'rgba(255,255,255,0.18)',marginTop:5}}>Hover to explore {FOODS.length} dishes</div>
        </div>
      )}
      <div style={{position:'absolute',bottom:26,left:34,display:'flex',gap:22,alignItems:'center',pointerEvents:'none',zIndex:30,fontFamily:"'DM Mono',monospace"}}>
        {[[34,197,94,'HEALTHY'],[234,179,8,'MODERATE'],[239,68,68,'INDULGENT']].map(([r,g,b,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:`rgb(${r},${g},${b})`,boxShadow:`0 0 8px rgba(${r},${g},${b},0.8)`}}/>
            <span style={{fontSize:8,color:'rgba(255,255,255,0.25)',letterSpacing:'0.14em'}}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{position:'absolute',bottom:26,right:34,fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'rgba(255,255,255,0.15)',letterSpacing:'0.22em',pointerEvents:'none',zIndex:30}}>{FOODS.length} DISHES</div>
      {hFood&&<Card food={hFood} pos={mPos}/>}
    </div>
  )
}
