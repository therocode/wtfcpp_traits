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
	SiteDir     string
	Port        int
	AllowOrigin []string
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

	cfg := &Configuration{}

	if err := viper.Unmarshal(cfg); err != nil {
		log.Printf("Failed to load config file: %v", err)
		return err
	} else {
		log.Printf("Config loaded")
	}

	// Setting up router global  CORS policy
	router.SetGlobalCors(&vestigo.CorsAccessControl{
		AllowOrigin:      cfg.AllowOrigin,
		AllowCredentials: false,
		ExposeHeaders:    []string{},
		MaxAge:           3600 * time.Second,
		AllowHeaders:     []string{},
	})

	//if you also serve static files from this application:
	// router.Get takes a handler func, so append .ServeHTTP to the end of the handler
	//router.Get("/", http.StripPrefix("/site/dist/", http.FileServer(http.Dir("site/dist/c"))).ServeHTTP)
	router.Get("/**", http.FileServer(http.Dir("site/dist")).ServeHTTP)

	//log.Fatal(http.ListenAndServeTLS(":" + cfg.Port, "MyCertificate.crt", "MyKey.key", router))
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(cfg.Port), router))
	log.Printf("Listening on port %d", cfg.Port)

	return nil
}

func initConfig() {
	viper.SetDefault("SiteDir", "./site/dist")
	viper.SetDefault("Port", 8001)
	viper.SetDefault("AllowOrigin", []string{})

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
