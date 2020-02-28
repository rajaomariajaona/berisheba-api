$(document).ready(() => {
  $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
    var value = $("select#filter").val();
    switch (value) {
      case "all":
        return true;
      case "not-authorized":
        return data[4].includes("Non-Autorisé");
      case "authorized":
        return (
          !data[4].includes("Non-Autorisé") && data[4].includes("Autorisé")
        );
      case "confirm":
        return data[4].includes("Accepter") || data[4].includes("Rejeter");

      default:
        return true;
    }
    return true;
  });
  var logout_btn = $("#logout");
  if (logout_btn) {
    logout_btn.click(() => {
      console.log("here");
      $("#logout-form").submit();
    });
  }
  $(".auth-btn").click(evt => {
    $("input#deviceid").val(evt.currentTarget.id);
    $("input#choice").val(
      $(evt.currentTarget).hasClass("accept") ? true : false
    );
    $("#device-form").submit();
  });
  var table = $("#dtBasicExample").DataTable({
    language: {
      sEmptyTable: "Aucune donnée disponible dans le tableau",
      sInfo: "Affichage de l'élément _START_ à _END_ sur _TOTAL_ éléments",
      sInfoEmpty: "Affichage de l'élément 0 à 0 sur 0 élément",
      sInfoFiltered: "(filtré à partir de _MAX_ éléments au total)",
      sInfoPostFix: "",
      sInfoThousands: ",",
      sLengthMenu: "Afficher _MENU_ éléments",
      sLoadingRecords: "Chargement...",
      sProcessing: "Traitement...",
      sSearch: "Rechercher :",
      sZeroRecords: "Aucun élément correspondant trouvé",
      oPaginate: {
        sFirst: "Premier",
        sLast: "Dernier",
        sNext: "Suivant",
        sPrevious: "Précédent",
      },
      oAria: {
        sSortAscending: ": activer pour trier la colonne par ordre croissant",
        sSortDescending:
          ": activer pour trier la colonne par ordre décroissant",
      },
      select: {
        rows: {
          _: "%d lignes sélectionnées",
          "0": "Aucune ligne sélectionnée",
          "1": "1 ligne sélectionnée",
        },
      },
    },
  });
  $("select#filter").change(() => {
    table.draw();
  });
});
