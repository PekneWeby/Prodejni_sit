document.addEventListener('DOMContentLoaded', function () {
    if(document.querySelector('.in-prodejni-sit')) {
        const select = document.getElementById('kraj');
        const baseUrl = dataLayer[0].shoptet.projectId;
        const shopsContainer = document.querySelector('.shopsVypis');

        function clearActiveClasses(className) {
            document.querySelectorAll(`.${className}`).forEach(element => element.classList.remove(className));
        }

        function createShopElement(shop) {
            let shopElement = document.createElement('div');
            shopElement.classList.add('col-xs-12');
            shopElement.classList.add('col-sm-6');
            shopElement.classList.add('col-md-4');
            shopElement.innerHTML = `
            <div class="shop">
            <div class="shop-image">
                <div class="shop-info">
                    <h2>${shop.name}</h2>
                    <p>${shop.address}</p>
                    <div id="udaje">
                        ${shop.email ? `<p><strong>E-mail: </strong>${shop.email}</p>` : ''}
                        ${shop.phone ? `<p><strong>Tel.: </strong>${shop.phone}</p>` : ''}
                        ${shop.webUrl ? `<p><strong>Web: </strong><a target="_blank" href="https://${shop.webUrl}">${shop.webUrl}</a></p>` : ''}
                    </div>
                </div>
                ${shop.imageUrl ? `<img src="${shop.imageUrl}" />` : ''}
                <div id="udajeText">   ${shop.text ? `<p>${shop.text}</p>` : ''}</div>
            </div>
            <div id="oteviraciDoba">
                <p><strong>Otevírací doba</strong></p>
                <p>Pondělí: ${shop.monday ?? ""}</p>
                <p>Úterý: ${shop.tuesday ?? ""}</p>
                <p>Středa: ${shop.wednesday ?? ""}</p>
                <p>Čtvrtek: ${shop.thursday ?? ""}</p>
                <p>Pátek: ${shop.friday ?? ""}</p>
                <p>Sobota: ${shop.saturday ?? ""}</p>
                <p>Neděle: ${shop.sunday ?? ""}</p>
            </div>
            </div>
        `;
            return shopElement;
        }

        function displayShops(data) {
            let text = data.text ?? '<div id="textNotStore"><p>V tomto kraji se prozatím nenachází žádná prodejna.</p><p><strong>Hledáme nové distributory!</strong></p><p>Chcete se stát součástí naší prodejní sítě a nabídnout zákazníkům špičkové produkty z oblasti pneumatického a aku nářadí?</p><p>Neváhejte nás kontaktovat – rádi s vámi probereme možnosti spolupráce a společně vybudujeme úspěšné partnerství <br> +420 724 860 343</p></div>';
            shopsContainer.innerHTML = (data.shops && data.shops.length > 0) ? '' : text;

            if(data.color){
                document.documentElement.style.setProperty('--active-fill', data.color);
            }

            if(data.colorRegion){
                document.documentElement.style.setProperty('--over-fill', data.colorRegion);
            }

            if(data.backgroundColor){
                document.documentElement.style.setProperty('--background-color', data.backgroundColor);
            }

            if(data.textColor){
                document.documentElement.style.setProperty('--text-colorSir', data.textColor);
            }

            if (data.shops) {
                data.shops.forEach(shop => shopsContainer.appendChild(createShopElement(shop)));
            }
        }

        function fetchAndDisplayShops(krajId) {
            fetch(`https://prodejnisit.scrskripty.cz/getShops/${krajId}/${baseUrl}`)
                .then(response => response.json())
                .then(displayShops)
                .catch(error => console.error('Chyba při načítání prodejen:', error));
        }

        function handleMapClick(element) {
            clearActiveClasses('mapaActive');
            clearActiveClasses('mapaOver');
            element.classList.add('mapaActive');
            select.value = element.getAttribute('data-id');
            fetchAndDisplayShops(select.value);
        }

        select.addEventListener('change', function () {
            const selectedValue = select.value;
            clearActiveClasses('mapaActive');
            const selectedElement = document.querySelector(`.ceska-mapa[data-id="${selectedValue}"]`);
            if (selectedElement) selectedElement.classList.add('mapaActive');
            fetchAndDisplayShops(selectedValue);
        });

        document.querySelectorAll('.ceska-mapa').forEach(element => {
            element.addEventListener('click', () => handleMapClick(element));

            element.addEventListener('mouseover', function () {
                clearActiveClasses('mapaOver');
                element.classList.add('mapaOver');
            });

            element.addEventListener('mouseout', function () {
                element.classList.remove('mapaOver');
            });
        });


        document.getElementById('fetchData').addEventListener('click', function () {
            fetchAndDisplayShops(select.value);
        });

        fetchAndDisplayShops(select.value);
    }
});
