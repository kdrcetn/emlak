const PropertyManager = {
  getProperties: function () {
    return JSON.parse(localStorage.getItem("emirProperties")) || [];
  },

  saveProperties: function (properties) {
    localStorage.setItem("emirProperties", JSON.stringify(properties));
  },

  init: function () {
    if (!localStorage.getItem("emirProperties")) {
      const sampleProperties = [
        {
          id: 1,
          title: "Örnek İlan 1",
          location: "İstanbul",
          type: "Satılık",
          price: "1.000.000 TL",
        },
      ];
      PropertyManager.saveProperties(sampleProperties);
    }
  },
};

// Initialize
PropertyManager.init();
