module com.example.coldstartong {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.coldstartong to javafx.fxml;
    exports com.example.coldstartong;
}