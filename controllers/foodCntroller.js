import puppeteer from "puppeteer";

const getFoods = async (nutrition, nova) => {
  try { 
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
      });

    const page = await browser.newPage();

    const url = "https://br.openfoodfacts.org/";

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    
    const foods = await page.evaluate((nutrition, nova) => {

        const foodList = document.querySelectorAll(".search_results > li");
        const result = [];
        foodList.forEach( food => {
            
            const list_product_a = food.querySelector(`.list_product_a`);
            const split_a = list_product_a.getAttribute('href').split("/");
            const product_id = split_a[4];
            const product_name = list_product_a.getAttribute('title')
            const titles = food.querySelectorAll(`.list_product_icons`);
            const nutriTitle = titles[0].getAttribute('title').split(" - ");
            const nutriSplit = nutriTitle[0].split(" ");
            const nutriScore = nutriSplit[1];
            const novaTitle = titles[1].getAttribute('title').split(" - ");
            const novaSplit = novaTitle[0].split(" ");
            const novaScore = Number(novaSplit[1]);
            
            if (nutriScore === nutrition && 
                novaScore == nova) 
                {
                  result.push({ 
                    "id": product_id,
                    "name": product_name, 
                    "search_value": split_a[5],
                    "nutrition": {"score": nutriScore, "title": nutriTitle[1]}, 
                    "nova": {"score": novaScore, "title": novaTitle[1]},
                 });
                }
            })

          return result;
        }, nutrition, nova);
    
    return foods;
} catch (error) { 

  console.log(error);
} 
}


async function findAll(req, res) {

  // #swagger.tags = ['Products']

   const data = await getFoods(
     req.params.nutrition,
     req.params.nova
   );

   return res.json(data);
}


async function findOne(req, res) {

  // #swagger.tags = ['Products']
  
   try {
    
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });

  const page = await browser.newPage();
  
  const id =  req.params.id;
  const search =  req.params.search_value;

  const url = `https://br.openfoodfacts.org/produto/${id}/${search}/`;

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

      const food = await page.evaluate(() => {
         
        const title = document.querySelector(".title-1").innerText;
        const quantity = document.querySelector("#field_quantity_value").innerText;
        const hasPalmOil = document.querySelector(
          "#panel_ingredients_analysis_en-palm-oil > li > a h4"
        );

        const isVegetarian = document.querySelector(
          "#panel_ingredients_analysis_en-vegetarian > li > a h4"
        );
        
        const isVegan = document.querySelector("#panel_ingredients_analysis_en-vegan > li > a h4");
        const score = document.querySelector(
          "a[href='#panel_nutriscore'] > div > div h4"
        );
        const split_score = score ? score.innerText.split(" ") : null;
        const list = document.querySelectorAll("#ordered_ingredients_list > li");
        const nutre_vals = document.querySelectorAll(".evaluation__title");
        const nutri_data = document.querySelectorAll("table[aria-label='Dados nutricionais'] > tbody > tr");
        const servingSize = document.querySelector(
          "#panel_serving_size_content > div > div > div"
          );
        const serv_spl = servingSize ? servingSize.innerText.split(":") : null;  
        
        const score_nova = document.querySelector("a[href='#panel_nova'] > div > div h4");
        const score_nova_sp = score_nova ? score_nova.innerText.split(" ") : null;
        const title_nova = document.querySelector("#panel_nova h4").innerText;
        
        const nutre_values = [];
        const list_ingred = [];
        const nutri = [];
        
        list.forEach( item => {

          const ingred = item.querySelector("span").innerText;
          list_ingred.push(ingred);
        }) 
         
        nutre_vals.forEach( val => {
          
          nutre_values.push([val.innerText]);
        }) 
        
        
        nutri_data.forEach( (data, key) => {
          
          const columns = data.querySelectorAll("td");
          
          columns.forEach( (columns, key) => {
             
            const span = columns.querySelector("span").innerText;
            if (key <= 1) {
              nutri.push(span)
            }
          })
        })  

        //nutri.splice(nutri.length - 2, nutri.length);
        
        const data = {};
        nutri.forEach( (nut, key) => {
            if (key % 2 == 0) {
              
              const perServing = nutri[key + 1].indexOf('\n') != -1 ? nutri[key + 1].split('\n') : '?';
              
              data[`${nut}`] = {
                'per100g': perServing === "?" ? nutri[key + 1] : perServing[0], 
                'perServing': perServing === "?" ? perServing : perServing[1]
              };
            }
        }) 

         return {
          "test": '',
          "title": title,
          "quantity": quantity,
          "ingredients": {
            "hasPalmOil": hasPalmOil ? hasPalmOil.innerText : 'unknown',
            "isVegan": isVegan ? isVegan.innerText : false,
            "isVegetarian": isVegetarian ? isVegetarian.innerText : false,
            "list": list_ingred
          },
          "nutrition": {
            "score": score ? split_score[1] : null,
            "values": nutre_values,
            "servingSize": servingSize ? serv_spl[1] : null,
            "data": data     
          },
          "nova": {
            "score": score_nova ?  Number(score_nova_sp[1]) : null,
            "title": title_nova
          }
        };     
      })
        
      return res.json(food);
   } catch (error) {
    
    console.log(error);
   }   
    
   
    
}


export default { findAll, findOne }