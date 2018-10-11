package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/husobee/vestigo"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	//_ "github.com/go-sql-driver/mysql"
)

type Configuration struct {
	SiteDir string
	Port    int
}

var rootCommand = &cobra.Command{
	Use:   "server",
	Short: "Start server",
	RunE:  rootCmdFunc,
}

func rootCmdFunc(cmd *cobra.Command, args []string) error {
	router := vestigo.NewRouter()
	// you can enable trace by setting this to true
	vestigo.AllowTrace = true

	// Setting up router global  CORS policy
	router.SetGlobalCors(&vestigo.CorsAccessControl{
		AllowOrigin:      []string{"*", "test.com"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"X-Header", "X-Y-Header"},
		MaxAge:           3600 * time.Second,
		AllowHeaders:     []string{"X-Header", "X-Y-Header"},
	})

	cfg := &Configuration{}

	if err := viper.Unmarshal(cfg); err != nil {
		log.Printf("Failed to load config file: %v", err)
		return err
	} else {
		log.Printf("Config loaded")
	}

	//services
	//var dogService dog.Service

	//initialise services
	//switch cfg.StorageMode {
	//case "mysql":
	//	//database migration
	//	if err := util.MysqlMigrateUp(cfg.DatabaseConnection, cfg.MigrateDir); err != nil {
	//		return err
	//	}

	//	//create database instance that services will use
	//	db, err := util.MysqlConnect(cfg.DatabaseConnection)
	//	if err != nil {
	//		return err
	//	}

	//	dogService = dog.NewSQLService(db)
	//case "dummy":
	//	//dogService = dog.NewDummySerbice(db)
	//default:
	//	return fmt.Errorf("Invalid storageMode: %s", cfg.StorageMode)
	//}
	//defer func() {
	//	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	//	dogService.Close(ctx)
	//	cancel()
	//}()

	//managers
	//dogManager := dog.NewManager(dogService)

	//api
	//dogAPI := dogapi.New(dogManager)

	//routes
	//dogAPI.RegisterRoutes(router)

	//if you also serve static files from this application:
	// strip the prefix "static" and serve files from the directory "static"
	// router.Get takes a handler func, so append .ServeHTTP to the end of the handler
	//router.Get("/", http.StripPrefix("/site/dist/", http.FileServer(http.Dir("site/dist/c"))).ServeHTTP)
	router.Get("/**", http.FileServer(http.Dir("site/dist")).ServeHTTP)

	//fs := http.FileServer(http.Dir(dir))
	//http.Handle("/", fs)
	//http.HandleFunc("/filter/", func(w http.ResponseWriter, r *http.Request) {
	//	http.ServeFile(w, r, "index.html")
	//})
	//router.Handle("/**", staticFs)

	// Below Applies Local CORS capabilities per Resource (both methods covered)
	// by default this will merge the "GlobalCors" settings with the resource
	// cors settings.  Without specifying the AllowMethods, the router will
	// accept any Request-Methods that have valid handlers associated
	//router.SetCors("/welcome", &vestigo.CorsAccessControl{
	//	AllowMethods: []string{"GET"},                    // only allow cors for this resource on GET calls
	//	AllowHeaders: []string{"X-Header", "X-Z-Header"}, // Allow this one header for this resource
	//})

	//log.Fatal(http.ListenAndServeTLS(":" + cfg.Port, "MyCertificate.crt", "MyKey.key", router))
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(cfg.Port), router))
	log.Printf("Listening on port %d", cfg.Port)

	return nil
}

func initConfig() {
	viper.SetDefault("SiteDir", "./site/dist")
	viper.SetDefault("Port", 8001)

	var cfgFile string

	rootCommand.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is config.toml)")

	failOnMissingConfig := false
	if cfgFile != "" {
		failOnMissingConfig = true
		viper.SetConfigFile(cfgFile)
		log.Printf("Using config: %s", cfgFile)
	} else {
		viper.AddConfigPath(".")
		viper.SetConfigName("config")
		log.Printf("Will use default config")
	}

	err := viper.ReadInConfig()            //find and read the config file
	if failOnMissingConfig && err != nil { // Handle errors reading the config file
		log.Fatal("Failed to read config", err)
	}
}

func main() {
	cobra.OnInitialize(initConfig)

	if err := rootCommand.Execute(); err != nil {
		os.Exit(1)
	}
}
